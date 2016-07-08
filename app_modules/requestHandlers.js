/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var fs = require("fs");
var url = require('url');
var formidable = require("formidable");
var _ = require('lodash');
var deferred = require('deferred');
var db = require("./db");
var querystring = require('querystring');

function _getMenuTemplate() {
    var menuObj = db.getMenu();
    var socialsObj = db.getHeadSocials();
    var mTemplate;
    var hTemplate;
    var mobileMenu = deferred();
    var headerMenu = deferred();
    var def;
    var result = deferred();

    deferred(menuObj, socialsObj)(
            function (resp) {
                fs.readFile("sources/templates/mobileNavmenu.html", function (error, data) {
                    if (error) {
                        mobileMenu.reject(error);
                    } else {
                        mTemplate = _.template(data);
                        mobileMenu.resolve(mTemplate({menus: resp[0]}));
                    }
                });
                fs.readFile("sources/templates/headerMenu.html", function (error, data) {
                    if (error) {
                        headerMenu.reject(error);
                    } else {
                        hTemplate = _.template(data);
                        headerMenu.resolve(hTemplate({menus: resp[0], socials: resp[1]}));
                    }
                });
                def = deferred(mobileMenu.promise, headerMenu.promise)(
                        function (data) {
                            var temp = "";
                            _.forEach(data, function (chunk) {
                                temp += chunk;
                            });
                            result.resolve(temp);
                        },
                        function (error) {
                            result.reject(error);
                        });
            },
            function (error) {
                console.log(error);
                result.reject(error);
            }
    );
    return result.promise;
}

function _getAdminMenuTemplate() {
    var menuObj = db.getAdminMenu();
    var mobileMenu = deferred();
    var headerMenu = deferred();
    var leftMenu = deferred();
    var result = deferred();

    menuObj(
            function (resp) {
                fs.readFile("sources/templates/mobileNavmenu.html", function (error, data) {
                    if (error) {
                        mobileMenu.reject(error);
                    } else {
                        var template = _.template(data);
                        mobileMenu.resolve(template({menus: resp}));
                    }
                });

                fs.readFile("sources/templates/adminHeaderMenu.html", function (error, data) {
                    if (error) {
                        headerMenu.reject(error);
                    } else {
                        var template = _.template(data);
                        headerMenu.resolve(template({menus: resp}));
                    }
                });

                fs.readFile("sources/templates/adminleftmenu.html", function (error, data) {
                    if (error) {
                        leftMenu.reject(error);
                    } else {
                        var template = _.template(data);
                        leftMenu.resolve(template({menus: resp}));
                    }
                });

                deferred(mobileMenu.promise, headerMenu.promise, leftMenu.promise)(
                        function (data) {
                            var temp = "";
                            _.forEach(data, function (chunk) {
                                temp += chunk;
                            });
                            result.resolve(temp);
                        },
                        function (error) {
                            result.reject(error);
                        });
            },
            function (error) {
                console.log(error);
                result.reject(error);
            }
    );

    return result.promise;
}


function _getHeadTemplate() {
    var head = deferred();
    fs.readFile("sources/templates/head.html", function (error, data) {
        if (error) {
            head.reject(error);
        } else {
            head.resolve(data);
        }
    });
    return head.promise;
}

function _getFooterTemplate() {
    var footer = deferred();
    fs.readFile("sources/templates/footer.html", function (error, data) {
        if (error) {
            footer.reject(error);
        } else {
            footer.resolve(data);
        }
    });
    return footer.promise;
}

function _getResponse(response, request, mimeType) {
    return fs.readFile("public/" + request.url, function (err, data) {
        if (err) {
            response.writeHead(500, {"Content-Type": "text/plain", "AccessControlAllowOrigin": "*"});
            response.write("Error opening file: " + request.url);
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": mimeType, "AccessControlAllowOrigin": "*"});
            response.write(data);
            response.end();
        }
    });
}

function _getVideoFile(response, request, type) {
    var path = './public/' + request.url;
    var stat = fs.statSync(path);
    var total = stat.size;
    if (request.headers['range']) {
        var range = request.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];
        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end - start) + 1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
        var file = fs.createReadStream(path, {start: start, end: end});
        response.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4', "AccessControlAllowOrigin": "*"});
        file.pipe(response);
    } else {
        console.log('ALL: ' + total);
        response.writeHead(200, {'Content-Length': total, 'Content-Type': type, "AccessControlAllowOrigin": "*"});
        fs.createReadStream(path).pipe(response);
    }
}

function _getServicePage(response, request, aboutObj) {
    var head = _getHeadTemplate();
    var menus = _getMenuTemplate();
    var footer = _getFooterTemplate();
    var serviceheaderpage = deferred();
    var aboutsection = deferred();

    fs.readFile("sources/templates/servicesheaderpage.html", function (error, data) {
        if (error) {
            serviceheaderpage.reject(error);
        } else {
            serviceheaderpage.resolve(data);
        }
    });

    fs.readFile("sources/templates/about.html", function (error, data) {
        if (error) {
            aboutsection.reject(error);
        } else {
            var template = _.template(data);
            aboutsection.resolve(template(aboutObj));
        }
    });

    deferred(head, menus, footer, serviceheaderpage.promise, aboutsection.promise, footer)(
            function (data) {
                response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                _.forEach(data, function (content) {
                    response.write(content);
                });
                response.write('<script type="text/javascript" src="/javascript/services.js"></script>');
                response.write('</body></html>');
                response.end();
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });
}


function _checkAdminEvents() {
    var totalContacts = db.getContactsCount();
    var processedContacts = db.getProcessedContactsCount();
    var failedContacts = db.getFailedContactsCount();
    var inprocessContacts = db.getInprocessContactsCount();
    var unprocessedContacts = db.getUnprocessedContactsCount();
    var totalTestimonials = db.getTestimonialsCount();
    var acceptedTestimonials = db.getAcceptedTestimonialsCount();
    var uncheckedTestimonials = db.getUncheckedTestimonialsCount();
    var totalBlogposts = db.getBlogpostsCount();
    var postedBlogposts = db.getPostedBlogpostsCount();
    var waitingBlogposts = db.getWaitingBlogpostsCount();

    var result = deferred();

    deferred(totalContacts, processedContacts, failedContacts,
            inprocessContacts, unprocessedContacts, totalTestimonials,
            acceptedTestimonials, uncheckedTestimonials, totalBlogposts,
            postedBlogposts, waitingBlogposts)(
            function (dataObj) {
                result.resolve({
                    totalContacts: dataObj[0],
                    processedContacts: dataObj[1],
                    failedContacts: dataObj[2],
                    inprocessContacts: dataObj[3],
                    unprocessedContacts: dataObj[4],
                    totalTestimonials: dataObj[5],
                    acceptedTestimonials: dataObj[6],
                    uncheckedTestimonials: dataObj[7],
                    totalBlogposts: dataObj[8],
                    postedBlogposts: dataObj[9],
                    waitingBlogposts: dataObj[10]
                });
            },
            function (error) {
                result.reject(error);
            }
    );

    return result.promise;
}

function _getAdminTable(response, request, query, pathname, table, count) {
    var qs = querystring.parse(query);
    var limit = Number(qs.lim) || 10;
    var skip = Number(qs.skip) || 0;

    if (limit && skip && (skip % limit !== 0)) {
        console.log("Not correct limit/skip options");
        unknown(response, request, pathname);
    } else {
        _getAdminTableTemplate(response, request, table, limit, skip, count, pathname);
    }
}

function _getAdminTableTemplate(response, request, table, limit, skip, count, pathname) {
    var head = _getHeadTemplate();
    var menus = _getAdminMenuTemplate();
    var footer = _getFooterTemplate();
    var body = deferred();
    var data = db.getTable(table, limit, skip);
    var pageCount = Math.ceil(count / limit);
    var currentPage = (skip / limit) + 1;

    data(
            function (dataObj) {

                fs.readFile("sources/templates/admintables.html", function (error, data) {
                    if (error) {
                        body.reject(error);
                    } else {
                        var template = _.template(data);
                        body.resolve(template({
                            table: dataObj,
                            tableName: table,
                            tableDescription: table + " table",
                            pageCount: pageCount,
                            currentPage: currentPage,
                            skip: skip,
                            limit: limit,
                            pathname: pathname
                        }));
                    }
                });
            },
            function (error) {
                body.reject(error);
            });

    deferred(head, menus, body.promise, footer)(
            function (data) {
                response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                _.forEach(data, function (content) {
                    response.write(content);
                });
                response.write('<script type="text/javascript" src="/javascript/adminmenu.js"></script>');
                response.write('<script type="text/javascript" src="/javascript/admintables.js"></script>');
                response.write('</body></html>');
                response.end();
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });
}

function home(response, request) {
    console.log("Home action");

    var head = _getHeadTemplate();
    var menus = _getMenuTemplate();
    var footer = _getFooterTemplate();
    var homevideo = deferred();
    var serviceoffer = deferred();
    var serviceofferData = db.getServiceOffers();
    var portfoliosection = deferred();
    var portfolioData = db.getHomePortfolio();
    var testimonialssection = deferred();
    var testimonialsData = db.getLatestTestimonials();
    var blogpostssection = deferred();
    var latestBlogposts = db.getLatestBlogposts();
    var homefooter = deferred();
    var homefooterSocials = db.getSocials();
    var homefooterLinks = db.getHomeFooter();

    fs.readFile("sources/templates/homevideo.html", function (error, data) {
        if (error) {
            homevideo.reject(error);
        } else {
            homevideo.resolve(data);
        }
    });

    serviceofferData(
            function (dataObj) {
                fs.readFile("sources/templates/serviceoffer.html", function (error, data) {
                    if (error) {
                        serviceoffer.reject(error);
                    } else {
                        var template = _.template(data);
                        serviceoffer.resolve(template({services: dataObj}));
                    }
                });
            },
            function (error) {
                serviceoffer.reject(error);
            });


    portfolioData(
            function (dataObj) {

                function syncObj(rowNum, elemNum, elsNum, sourceObj, targetObj) {
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].type += ' ' + sourceObj.type;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].img = sourceObj.img;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].title = sourceObj.title;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].shortTextM = sourceObj.shortTextM;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].shortTextS = sourceObj.shortTextS;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].link = sourceObj.link;

                    if (targetObj.rows[rowNum].elements[elemNum].els[elsNum].hasOwnProperty('longText') && sourceObj.longText) {
                        targetObj.rows[rowNum].elements[elemNum].els[elsNum].longText += sourceObj.longText;
                    }

                    if (targetObj.rows[rowNum].elements[elemNum].els[elsNum].hasOwnProperty('outerLinks') && sourceObj.outerLinks) {
                        targetObj.rows[rowNum].elements[elemNum].els[elsNum].outerLinks = sourceObj.outerLinks;
                    }

                }

                var txts = [];
                var portfolios = [];
                var portObj = {
                    rows: [
                        {elements: [{proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3", els: [{type: "holder", classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-right-large border-bottom-medium border-bottom-small", img: [], title: "", longText: "", shortTextM: "", shortTextS: "", link: ""}]},
                                {proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9", els: [{type: "holder", classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-right-large border-bottom-medium border-bottom-small border-right-medium", img: [], title: "", shortTextM: "", shortTextS: "", link: "", outerLinks: []},
                                        {type: "holder", classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-bottom-medium border-bottom-small", img: [], title: "", shortTextM: "", shortTextS: "", link: "", outerLinks: []}]}]},
                        {elements: [{proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9", els: [{type: "holder", classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small", img: [], title: "", shortTextM: "", shortTextS: "", link: "", outerLinks: []},
                                        {type: "holder", classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small", img: [], title: "", shortTextM: "", shortTextS: "", link: "", outerLinks: []}]},
                                {proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3", els: [{type: "holder", classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-top-large border-top-medium", img: [], title: "", longText: "", shortTextM: "", shortTextS: "", link: ""}]}]}
                    ]};

                _.forEach(dataObj, function (item) {
                    switch (item.type) {
                        case 'txt':
                            txts.push(item);
                            break;
                        case 'portfolio':
                            portfolios.push(item);
                            break;
                        default:
                            break;
                    }
                });

                if (txts.length !== 2 || portfolios.length !== 4) {
                    return portfoliosection.reject("Wrong number or portfolios");
                }

                syncObj(0, 0, 0, txts[0], portObj);
                syncObj(1, 1, 0, txts[1], portObj);
                syncObj(0, 1, 0, portfolios[0], portObj);
                syncObj(0, 1, 1, portfolios[1], portObj);
                syncObj(1, 0, 0, portfolios[2], portObj);
                syncObj(1, 0, 1, portfolios[3], portObj);

                fs.readFile("sources/templates/portfoliosection.html", function (error, data) {
                    if (error) {
                        portfoliosection.reject(error);
                    } else {
                        var template = _.template(data);
                        portfoliosection.resolve(template(portObj));
                    }
                });
            },
            function (error) {
                portfoliosection.reject(error);
            });

    testimonialsData(
            function (dataObj) {
                fs.readFile("sources/templates/testimonialssection.html", function (error, data) {
                    if (error) {
                        testimonialssection.reject(error);
                    } else {
                        var template = _.template(data);
                        testimonialssection.resolve(template({testimonials: dataObj}));
                    }
                });
            },
            function (error) {
                testimonialssection.reject(error);
            });


    latestBlogposts(
            function (dataObj) {
                fs.readFile("sources/templates/blogpostssection.html", function (error, data) {
                    if (error) {
                        blogpostssection.reject(error);
                    } else {
                        var template = _.template(data);
                        blogpostssection.resolve(template({blogs: dataObj}));
                    }
                });
            },
            function (error) {
                blogpostssection.reject(error);
            });


    deferred(homefooterSocials, homefooterLinks)(
            function (dataObj) {
                fs.readFile("sources/templates/homefooter.html", function (error, data) {
                    if (error) {
                        homefooter.reject(error);
                    } else {
                        var template = _.template(data);
                        homefooter.resolve(template({
                            logo: {
                                link: '/contact/',
                                title: 'MediaNovak Homepage',
                                imgLink: '/content/sources/connect-with-us.png',
                                imgAlt: 'MediaNovak Logo'
                            },
                            socials: dataObj[0],
                            items: dataObj[1]}));
                    }
                });
            },
            function (error) {
                homefooter.reject(error);
            });

    deferred(head, menus, homevideo.promise, serviceoffer.promise, portfoliosection.promise, testimonialssection.promise, blogpostssection.promise, homefooter.promise, footer)(
            function (data) {
                response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                _.forEach(data, function (content) {
                    response.write(content);
                });
                response.write('<script type="text/javascript" src="/javascript/home.js"></script>');
                response.write('</body></html>');
                response.end();
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });
}

function websiteDesign(response, request) {
    console.log("Website Design action");

    var about = db.getAbout('website design');

    about(
            function (aboutObj) {
                if (aboutObj === null) {
                    console.log("No data found");
                    unknown(response, request);
                } else {
                    _getServicePage(response, request, aboutObj);
                }
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });

}

function logoDesign(response, request) {
    console.log("Logo Design action");

    var about = db.getAbout('logo design');

    about(
            function (aboutObj) {
                if (aboutObj === null) {
                    console.log("No data found");
                    unknown(response, request);
                } else {
                    _getServicePage(response, request, aboutObj);
                }
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });

}

function branding(response, request) {
    console.log("Branding action");

    var about = db.getAbout('branding');

    about(
            function (aboutObj) {
                if (aboutObj === null) {
                    console.log("No data found");
                    unknown(response, request);
                } else {
                    _getServicePage(response, request, aboutObj);
                }
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });

}

function portfolio(response, request) {
    console.log("Portfolio action");

    var head = _getHeadTemplate();
    var menus = _getMenuTemplate();
    var footer = _getFooterTemplate();
    var portfoliomenu = deferred();

    fs.readFile("sources/templates/portfolioMenu.html", function (error, data) {
        if (error) {
            portfoliomenu.reject(error);
        } else {
            portfoliomenu.resolve(data);
        }
    });

    deferred(head, menus, portfoliomenu.promise, footer)(
            function (data) {
                response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                _.forEach(data, function (content) {
                    response.write(content);
                });
                response.write('<script type="text/javascript" src="/javascript/portfolio.js"></script>');
                response.write('</body></html>');
                response.end();
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });
}

function unknown(response, request, pathname) {
    pathname = pathname || url.parse(request.url).pathname;
    if (request.url.indexOf(".css") !== -1) {
        _getResponse(response, request, "text/css");
    } else if (request.url.indexOf(".js") !== -1) {
        _getResponse(response, request, "text/javascript");
    } else if (request.url.indexOf(".html") !== -1) {
        _getResponse(response, request, "text/html");
    } else if (request.url.indexOf(".png") !== -1 || request.url.indexOf(".gif") !== -1
            || request.url.indexOf(".ico") !== -1 || request.url.indexOf(".jpg") !== -1) {
        _getResponse(response, request, "image");
    } else if (request.url.indexOf(".oft") !== -1) {
        _getResponse(response, request, "application/font-otf");
    } else if (request.url.indexOf(".ttf") !== -1) {
        _getResponse(response, request, "application/font-ttf");
    } else if (request.url.indexOf(".woff") !== -1) {
        if (request.url.indexOf(".woff2") !== -1) {
            _getResponse(response, request, "font/woff2");
        } else {
            _getResponse(response, request, "font/woff");
        }
    } else if (request.url.indexOf(".eot") !== -1) {
        _getResponse(response, request, "application/vnd.ms-fontobject");
    } else if (request.url.indexOf(".svg") !== -1) {
        _getResponse(response, request, "image/svg+xml");
    } else if (request.url.indexOf(".mp4") !== -1) {
        _getVideoFile(response, request, "video/mp4");
    } else {
        pathname =
                console.log("Unknown handler: " + pathname);

        var head = _getHeadTemplate();
        var body = deferred();

        fs.readFile("sources/templates/notfound.html", function (error, data) {
            if (error) {
                body.reject(error);
            } else {
                body.resolve(data);
            }
        });

        deferred(head, body.promise)(
                function (data) {
                    response.writeHead(404, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                    _.forEach(data, function (content) {
                        response.write(content);
                    });
                    response.write('</body></html>');
                    response.end();
                },
                function (error) {
                    response.writeHead(500, {"Content-Type": "text/plain", "AccessControlAllowOrigin": "*"});
                    response.write(error);
                    response.end();
                });
    }
}

function authorization(response, request) {
    if (request.session && request.session.get('authorized', 'false')) {
        response.writeHead(200, {'Location': "/adminpage"});
        response.end();
    } else {
        var head = _getHeadTemplate();
        var body = deferred();

        fs.readFile("sources/templates/authorization.html", function (error, data) {
            if (error) {
                body.reject(error);
            } else {
                body.resolve(data);
            }
        });


        deferred(head, body.promise)(
                function (data) {
                    response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                    _.forEach(data, function (content) {
                        response.write(content);
                    });
                    response.write('</body></html>');
                    response.end();
                },
                function (error) {
                    console.log(error);
                    unknown(response, request);
                });
    }
}

function checkLogin(response, request) {
    function checkData(){
        
    }
    
    if (request.method === "POST") {
        var postData = '';
        request.setEncoding("utf8");
        request.on('data', function (chunk) {
            postData += chunk;
        });
        request.on('end', function () {
            console.log(querystring.parse(postData));
            response.writeHead(303, {Location: "/authorization"});
            response.end();
        });


    } else {
        response.writeHead(303, {Location: "/authorization"});
        response.end();
    }
}

function adminpage(response, request) {
    var head = _getHeadTemplate();
    var menus = _getAdminMenuTemplate();
    var footer = _getFooterTemplate();
    var body = deferred();
    var updates = _checkAdminEvents();
    updates(
            function (dataObj) {
                fs.readFile("sources/templates/adminpage.html", function (error, data) {
                    if (error) {
                        body.reject(error);
                    } else {
                        var template = _.template(data);
                        body.resolve(template(dataObj));
                    }
                });
            },
            function (error) {
                body.reject(error);
            });

    deferred(head, menus, body.promise, footer)(
            function (data) {
                response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                _.forEach(data, function (content) {
                    response.write(content);
                });
                response.write('<script type="text/javascript" src="/javascript/adminmenu.js"></script>');
                response.write('<script type="text/javascript" src="/javascript/adminhome.js"></script>');
                response.write('</body></html>');
                response.end();
            },
            function (error) {
                console.log(error);
                unknown(response, request);
            });
}

function adminTestimonials(response, request, query, pathname) {
    var pageCount = db.getTestimonialsCount();

    pageCount(
            function (count) {
                _getAdminTable(response, request, query, pathname, 'testimonials', count);
            },
            function (error) {
                console.log(error);
                unknown(response, request, pathname);
            });
}

function adminContacts(response, request, query, pathname) {
    var pageCount = db.getContactsCount();

    pageCount(
            function (count) {
                _getAdminTable(response, request, query, pathname, 'contacts', count);
            },
            function (error) {
                console.log(error);
                unknown(response, request, pathname);
            });
}

function adminBlogposts(response, request, query, pathname) {
    var pageCount = db.getBlogpostsCount();

    pageCount(
            function (count) {
                _getAdminTable(response, request, query, pathname, 'blogposts', count);
            },
            function (error) {
                console.log(error);
                unknown(response, request, pathname);
            });
}

function adminServices(response, request, query, pathname) {
    var pageCount = db.getServicesCount();

    pageCount(
            function (count) {
                _getAdminTable(response, request, query, pathname, 'about', count);
            },
            function (error) {
                console.log(error);
                unknown(response, request, pathname);
            });
}

function adminOffers(response, request, query, pathname) {
    var pageCount = db.getServicesCount();

    pageCount(
            function (count) {
                _getAdminTable(response, request, query, pathname, 'offers', count);
            },
            function (error) {
                console.log(error);
                unknown(response, request, pathname);
            });
}

function checkUpdates(response, request) {
    var result = _checkAdminEvents();

    result(
            function (data) {
                response.writeHead(200, {"Content-Type": "application/json", "AccessControlAllowOrigin": "*"});
                response.write(JSON.stringify(data));
                response.end();
            },
            function (error) {
                response.writeHead(404, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                response.write(error);
                response.end();
            });
}

function upload(response, request) {
    console.log("Upload action");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        fs.rename(files.upload.path, "public/content/sources/logo.png", function (err) {
            if (err) {
                fs.unlink("public/content/sources/logo.png");
                fs.rename(files.upload.path, "public/content/sources/logo.png");
            }
        });
        response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
        response.write("recieved image: <br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request) {
    console.log("Show action");
    fs.readFile("public/content/sources/logo.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain", "AccessControlAllowOrigin": "*"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png", "AccessControlAllowOrigin": "*"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.home = home;
exports.websiteDesign = websiteDesign;
exports.logoDesign = logoDesign;
exports.branding = branding;
exports.upload = upload;
exports.portfolio = portfolio;
exports.show = show;
exports.unknown = unknown;
exports.adminpage = adminpage;
exports.checkUpdates = checkUpdates;
exports.adminTestimonials = adminTestimonials;
exports.adminContacts = adminContacts;
exports.adminBlogposts = adminBlogposts;
exports.adminServices = adminServices;
exports.adminOffers = adminOffers;
exports.authorization = authorization;
exports.checkLogin = checkLogin;
