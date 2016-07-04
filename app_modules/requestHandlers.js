/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var fs = require("fs");
var formidable = require("formidable");
var _ = require('lodash');
var deferred = require('deferred');
var db = require("./db")


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
                fs.readFile("public/templates/mobileNavmenu.html", function (error, data) {
                    if (error) {
                        console.log(error);
                        mobileMenu.reject(error);
                    } else {
                        mTemplate = _.template(data);
                        mobileMenu.resolve(mTemplate({menus: resp[0]}));
                    }
                });
                fs.readFile("public/templates/headerMenu.html", function (error, data) {
                    if (error) {
                        console.log(error);
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


function _getHeadTemplate() {
    var head = deferred();
    fs.readFile("public/templates/head.html", function (error, data) {
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
    fs.readFile("public/templates/footer.html", function (error, data) {
        if (error) {
            footer.reject(error);
        } else {
            footer.resolve(data);
        }
    });
    return footer.promise;
}

var menu = {
    menus: [
        {
            name: "home",
            link: "/"
        },
        {
            name: "services",
            link: "/website-design",
            children: [
                {
                    name: "website design",
                    link: "/website-design"
                },
                {
                    name: "logo design",
                    link: "/logo-design"
                },
                {
                    name: "branding",
                    link: "/branding"
                }
            ]
        },
        {
            name: "website design",
            link: "/website-design"
        },
        {
            name: "portfolio",
            link: "/portfolio"
        },
        {
            name: "get a quote",
            link: "/get-a-quote"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "testimonials",
            link: "/testimonials"
        },
        {
            name: "contact",
            link: "/contact"
        }
    ],
    socials: [
        {
            name: "Facebook",
            link: "https://www.facebook.com/MediaNovak",
            class: "fa-facebook"
        },
        {
            name: "Twitter",
            link: "https://twitter.com/medianovak",
            class: "fa-twitter"
        },
        {
            name: "Instagram",
            link: "https://www.instagram.com/media_novak/",
            class: "fa-instagram"
        },
        {
            name: "Behance",
            link: "https://www.behance.net/MediaNovak",
            class: "fa-behance"
        }
    ]
};
function _getResponse(response, request, type) {
    return fs.readFile("public/" + request.url, function (err, data) {
        if (err) {
            response.writeHead(500, {"Content-Type": "text/plain", "AccessControlAllowOrigin": "*"});
            response.write("Error opening file: " + request.url);
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": type, "AccessControlAllowOrigin": "*"});
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

function _getServicePage(response, request, aboutObj, js) {
    var html = "";

    fs.readFile("public/templates/head.html", function (error, data) {
        if (error) {
            unknown(response, request);
        } else {
            html += data;
            fs.readFile("public/templates/mobileNavmenu.html", function (error, data) {
                if (error) {
                    unknown(response, request);
                } else {
                    var template = _.template(data);
                    html += template(menu);
                    fs.readFile("public/templates/headerMenu.html", function (error, data) {
                        if (error) {
                            unknown(response, request);
                        } else {
                            var template = _.template(data);
                            html += template(menu);
                            fs.readFile("public/templates/servicesHeaderPage.html", function (error, data) {
                                if (error) {
                                    unknown(response, request);
                                } else {
                                    html += data;
                                    fs.readFile("public/templates/about.html", function (error, data) {
                                        if (error) {
                                            unknown(response, request);
                                        } else {
                                            var template = _.template(data);
                                            html += template(aboutObj);
                                            fs.readFile("public/templates/footer.html", function (error, data) {
                                                if (error) {
                                                    unknown(response, request);
                                                } else {
                                                    html += data;
                                                    response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                                                    response.write(html);
                                                    response.write('<script type="text/javascript" src="/javascript/' + js + '.js"></script>');
                                                    response.write('</body></html>');
                                                    response.end();
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function home(response, request) {
    console.log("Home action");

    var portfolioObj = {
        rows: [
            {
                elements: [
                    {
                        proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                        els: [
                            {
                                type: "holder txt",
                                classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-right-large border-bottom-medium border-bottom-small",
                                img: ["fix1.png", "fix2.png"],
                                title: "website design & development",
                                longText: "Plenty of folks think that web design is all about slapping some words and pictures together and posting them online. No doubt that sort of attitude has created some of the atrocious and non-working web sites we see...",
                                shortTextM: "Plenty of folks think that web design is all about slapping some words and pictures together and posting them online.",
                                shortTextS: "Plenty of folks think that web design is all about...",
                                link: "/web-design-portfolio/"
                            }
                        ]
                    },
                    {
                        proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                        els: [
                            {
                                type: "holder portfolio",
                                classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-right-large border-bottom-medium border-bottom-small border-right-medium",
                                img: ["danielle-heinson-photography-logo-design-concept-1-1200x650.jpg"],
                                title: "Danielle Heinson Photography Logo Design",
                                shortTextM: "Check out the new logo we designed for Danielle Heinson Photography! “Media Novak has been incredible! I knew I wanted to hire them when I…",
                                shortTextS: "Check out the new logo we designed for Danielle Heinson…",
                                link: "/danielle-heinson-photography-logo-design/",
                                outerLinks: [
                                    "https://medianovak.com/projects/danielle-heinson-photography-logo-design/",
                                    "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/danielle-heinson-photography-logo-design/",
                                    "https://twitter.com/home?status=https://medianovak.com/projects/danielle-heinson-photography-logo-design/"
                                ]
                            },
                            {
                                type: "holder portfolio",
                                classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-bottom-medium border-bottom-small",
                                img: ["modern-boudoir-photography-website-design-media-novak-4-1200x650.jpg"],
                                title: "Modern Boudoir Photography Gets a Brand New Website",
                                shortTextM: " ",
                                shortTextS: " ",
                                link: "/modern-boudoir-photography-website-design/",
                                outerLinks: [
                                    "https://medianovak.com/projects/modern-boudoir-photography-website-design/",
                                    "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/modern-boudoir-photography-website-design/",
                                    "https://twitter.com/home?status=https://medianovak.com/projects/modern-boudoir-photography-website-design/"
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                elements: [
                    {
                        proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                        els: [
                            {
                                type: "holder portfolio",
                                classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                img: ["kaytee-ruth-photography-website-design-11-1200x650.jpg"],
                                title: "Kaytee Ruth Photography Website Design",
                                shortTextM: "I am so thankful for MediaNovak!! My experience with them was more than exceptional and the whole process was stress free for me! Everything was delivered in a timely manner and if it wasn’t, it was my fault! What they have created for my business is “hit the nail on the head” what I wanted […]",
                                shortTextS: "I am so thankful for MediaNovak!! My experience with them…",
                                link: "/kaytee-ruth-photography-website-design/",
                                outerLinks: [
                                    "https://medianovak.com/projects/kaytee-ruth-photography-website-design/",
                                    "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/kaytee-ruth-photography-website-design/",
                                    "https://twitter.com/home?status=https://medianovak.com/projects/kaytee-ruth-photography-website-design/"
                                ]
                            },
                            {
                                type: "holder portfolio",
                                classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                img: ["melissa-lyn-photography-logo-design-media-novak-1-1200x650.jpg"],
                                title: "Melissa Lyn Photography Logo Design by Media Novak",
                                shortTextM: "Check out the new logo we created for Melissa Lyn Photography! “So far, I am very impressed with Mark & his design team! I was nervous about hiring someone to create a new logo and website for my business, especially when I didn’t know exactly what I wanted. Mark was very quick to respond to […]",
                                shortTextS: "Check out the new logo we created for Melissa Lyn…",
                                link: "/melissa-lyn-photography-logo-design/",
                                outerLinks: [
                                    "https://medianovak.com/projects/melissa-lyn-photography-logo-design/",
                                    "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/melissa-lyn-photography-logo-design/",
                                    "https://twitter.com/home?status=https://medianovak.com/projects/melissa-lyn-photography-logo-design/"
                                ]
                            }
                        ]
                    },
                    {
                        proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                        els: [
                            {
                                type: "holder txt",
                                classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-top-large border-top-medium",
                                img: ["fix3.png", "fix2.png"],
                                title: "Logo Design & Branding",
                                longText: "MediaNovak has taken what was once a long, expensive process and turned it into an easy, even fun experience. With a little input from you about your company, our professional logo designers will provide you with a great-looking...",
                                shortTextM: "MediaNovak has taken what was once a long, expensive process and turned it into an easy, even fun experience.",
                                shortTextS: "MediaNovak has taken what was once a long, expensive process...",
                                link: "/logo-design-portfolio/"
                            }
                        ]
                    }
                ]
            }
        ]
    };

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

    fs.readFile("public/templates/homevideo.html", function (error, data) {
        if (error) {
            homevideo.reject(error);
        } else {
            homevideo.resolve(data);
        }
    });

    serviceofferData(
            function (dataObj) {
                fs.readFile("public/templates/serviceoffer.html", function (error, data) {
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
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].longText = sourceObj.longText;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].shortTextM = sourceObj.shortTextM;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].shortTextS = sourceObj.shortTextS;
                    targetObj.rows[rowNum].elements[elemNum].els[elsNum].link = sourceObj.link;

                    if (targetObj.rows[rowNum].elements[elemNum].els[elsNum].longText && sourceObj.longText) {
                        targetObj.rows[rowNum].elements[elemNum].els[elsNum].longText += sourceObj.longText;
                    }

                    if (targetObj.rows[rowNum].elements[elemNum].els[elsNum].outerLinks && sourceObj.outerLinks) {
                        targetObj.rows[rowNum].elements[elemNum].els[elsNum].outerLinks = sourceObj.outerLinks;
                    }
                    ;
                }

                var txts = [];
                var portfolios = [];
                var portObj = {
                    rows: [
                        {
                            elements: [
                                {
                                    proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                                    els: [
                                        {
                                            type: "holder",
                                            classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-right-large border-bottom-medium border-bottom-small",
                                            img: [],
                                            title: "",
                                            longText: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: ""
                                        }
                                    ]
                                },
                                {
                                    proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                                    els: [
                                        {
                                            type: "holder",
                                            classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-right-large border-bottom-medium border-bottom-small border-right-medium",
                                            img: [],
                                            title: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: "",
                                            outerLinks: []
                                        },
                                        {
                                            type: "holder",
                                            classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-bottom-medium border-bottom-small",
                                            img: [],
                                            title: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: "",
                                            outerLinks: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            elements: [
                                {
                                    proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                                    els: [
                                        {
                                            type: "holder",
                                            classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                            img: [],
                                            title: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: "",
                                            outerLinks: []
                                        },
                                        {
                                            type: "holder",
                                            classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                            img: [],
                                            title: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: "",
                                            outerLinks: []
                                        }
                                    ]
                                },
                                {
                                    proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                                    els: [
                                        {
                                            type: "holder",
                                            classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-top-large border-top-medium",
                                            img: [],
                                            title: "",
                                            longText: "",
                                            shortTextM: "",
                                            shortTextS: "",
                                            link: ""
                                        }
                                    ]
                                }
                            ]
                        }
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

                fs.readFile("public/templates/portfoliosection.html", function (error, data) {
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
                fs.readFile("public/templates/testimonialssection.html", function (error, data) {
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
                fs.readFile("public/templates/blogpostssection.html", function (error, data) {
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
                fs.readFile("public/templates/homefooter.html", function (error, data) {
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


function portfolio(response, request) {
    console.log("Portfolio action");
    fs.readFile("public/portfolio.html", function (error, data) {
        if (error) {
            unknown(response, request);
        } else {
            response.writeHead(200, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
            response.write(data);
            response.end();
        }
    });
}


function websiteDesign(response, request) {
    console.log("Website Design action");
    var aboutObj = {
        name: "website design",
        titleTop: "WEBSITE DESIGN",
        titleBottom: "& DEVELOPMENT",
        items:
                [
                    {
                        img: "online-marketing-explained-1"
                    },
                    {
                        img: "critical-logo-design-tips-1"
                    },
                    {
                        img: "photography-portfolio-secrets-1"
                    },
                    {
                        img: "business-card-guidelines-2"
                    }
                ],
        text1: "Plenty of folks think that web design is all about slapping " +
                "some words and pictures together and posting them online. " +
                "No doubt that sort of attitude has created some of the atrocious " +
                "and non-working web sites we see out there. At MediaNovak, we " +
                "know that web design involves a lot of work – and we’re not scared " +
                "to roll up our sleeves and get our hands dirty. What this means is " +
                "that we take the time to understand our clients, their businesses " +
                "and their hopes and dreams for the future.",
        text2: "In 2014, more people will access the Internet via mobile devices " +
                "than desktop PCs. For this reason, we make sure that when people " +
                "visit your website, they will see a beautifully designed interface " +
                "that is fully optimised for the device it’s served on – be that a " +
                "widescreen desktop computer, laptop, tablet or mobile. We also " +
                "consider your existing brand, logo, collateral, and primary audience. " +
                "We take into account your budget, who your clients are, and what your business is " +
                "all about. That’s because we don’t want to create a cookie-cutter web site. " +
                "Please understand: we don’t have anything against cookies (in fact, we have " +
                "bonded with chocolate chip cookies while working late to meet client deadlines " +
                "many a time). However, we think that your business deserves a personalized " +
                "web site that works for you – not for just anyone in your field.",
        textBig: "WE BUILD CUSTOM WEBSITES THAT ACTUALLY GROW YOUR BUSINESS, BRING IN MORE LEADS AND INCREASE YOUR BOTTOM LINE."
    };
    _getServicePage(response, request, aboutObj, "services");
}

function logoDesign(response, request) {
    console.log("Logo Design action");
    var aboutObj = {
        name: "logo design",
        titleTop: "LOGO DESIGN",
        titleBottom: "& COLLATERAL",
        items:
                [
                    {
                        img: "online-marketing-explained-1"
                    },
                    {
                        img: "critical-logo-design-tips-1"
                    },
                    {
                        img: "photography-portfolio-secrets-1"
                    },
                    {
                        img: "business-card-guidelines-2"
                    }
                ],
        text1: "MediaNovak has taken what was once a long, expensive process and " +
                "turned it into an easy, even fun experience. With a little input " +
                "from you about your company, our professional logo designers will " +
                "provide you with a great-looking, custom company logo design quickly " +
                "and inexpensively. Design and branding of your logo along with company " +
                "messaging is important for any size company. A logo design often " +
                "requires many revisions and hours of research into other brands in " +
                "your marketplace. Our design and marketing team can assist you in a " +
                "variety of branding and messaging needs.",
        text2: "A good logo is the heart and soul of your business image. It has the " +
                "ability to speak volumes with whispers, captivate prospective customers, " +
                "and foster emotional loyalty. Your logo can communicate your company philosophy " +
                "and generate brand pride in one fell swoop. At MediaNovak, we take the time to " +
                "get to know you, your company, and your competitors, to make sure the image " +
                "we create resonates with your customers and sets you in front of the pack. " +
                "We ask a lot of questions and listen to the answers to find a clear-cut " +
                "direction. Once we have established the brand objectives and your target " +
                "market, we get to work designing. We then get your feedback, and make any " +
                "necessary adjustments before handing off the final files.",
        textBig: "YOUR LOGO IS THE FACE OF YOUR BRAND. IT SHOULD BE STRIKING, EASILY RECOGNIZED AND APPROPRIATE TO YOUR BUSINESS."
    };
    _getServicePage(response, request, aboutObj, "services");
}

function branding(response, request) {
    console.log("Branding action");
    var aboutObj = {
        name: "branding",
        titleTop: "BRANDING",
        titleBottom: "& STATIONARY",
        items:
                [
                    {
                        img: "online-marketing-explained-1"
                    },
                    {
                        img: "critical-logo-design-tips-1"
                    },
                    {
                        img: "photography-portfolio-secrets-1"
                    },
                    {
                        img: "business-card-guidelines-2"
                    }
                ],
        text1: "A brand isn’t just a pretty logo, engaging website or strategic marketing plan. It is a deliberate, cohesive message. A story. An idea and connection transformed into an experience. Your brand is an ecosystem powered by all the things you represent – from your core values to the way you interact with your clients to the form and function that exists within your design. Here at MediaNovak we understand how to apply the colors and fonts of your logo to your business cards, letterheads and compliments slips in order to create an image your clients will remember.",
        text2: "Nothing makes a business look more credible than professionally designed stationery. Nearly everyone has been handed a cheap business card or received business correspondence on a generic letterhead. It leaves you wondering if the business is reliable or if they’re a fly-by-night. By contrast, professionally designed stationery helps to form a lasting impression in the minds of your potential clients and business partners. They’ll not only remember you, but they’ll know that you’re a serious business that they can trust. An investment in professionally designed stationery will pay off every time you hand out your business card and every time you send a letter.",
        textBig: "OUR GOAL IS TO BUILD SOMETHING THAT IS HIGHLY-TARGETED TO YOUR INTENDED AUDIENCES, INTUITIVE, USEFUL, MAYBE EVEN FUN."
    };
    _getServicePage(response, request, aboutObj, "services");
}

function unknown(response, request) {
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
        console.log("Unknown handler:");
        fs.readFile("public/nf.html", function (error, data) {
            if (error) {
                response.writeHead(500, {"Content-Type": "text/plain", "AccessControlAllowOrigin": "*"});
                response.write(error);
                response.end();
            } else {
                response.writeHead(404, {"Content-Type": "text/html", "AccessControlAllowOrigin": "*"});
                response.write(data);
                response.end();
            }
        });
    }
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
