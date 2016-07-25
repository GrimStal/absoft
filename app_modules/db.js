/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var deferred = require('deferred');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var _ = require('lodash');

var host;
var port;
var login;
var password;
var dataBase;
var connectStr;

if (process.env.NODE_ENV === "development") {
    host = 'localhost';
    port = '27017';
    login = "medianovak";
    password = "1zaBEtcVmv";
    dataBase = "medianovak";
    connectStr = "mongodb://" + login + ":" + password + "@" + host + ":" + port + "/" + dataBase;
} else {
    host = 'SG-medianovak-7929.servers.mongodirector.com';
    port = '27017';
    login = "grimstal";
    password = "1234567890123456";
    dataBase = "medianovak";
    connectStr = "mongodb://" + login + ":" + password + "@" + host + ":" + port + "/" + dataBase + "?ssl=true";
}


/** Param 'options' is object of options, like 'sort', fields, 'etc'
 * 
 * @param {string} collection
 * @param {object} select
 * @param {object} options
 * @returns {unresolved}
 */
function _findTemplate(collection, select, options) {
    var result = deferred();
    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(collection);
            table.find(select, options).toArray(function (err, docs) {
                if (!err) {
                    result.resolve(docs);
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });
    return result.promise;
}

function _aggregateTemplate(collection, aggrCollection, localField, foreignField, neededValue, options) {
    var result = deferred();

    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(collection);
            table.aggregate(
                    [
                        {$lookup: {
                                from: aggrCollection,
                                localField: localField,
                                foreignField: foreignField,
                                as: localField
                            }},
                        {$unwind: {path: "$" + localField, preserveNullAndEmptyArrays: true}},
                        {$skip: options.skip || 0},
                        {$limit: options.limit},
                        {$sort: options.sort}
                    ]
                    )
                    .map(function (data) {
                        if (data[localField] && data[localField][neededValue]) {
                            data[localField] = data[localField][neededValue];
                        }
                        if (!data[localField]) {
                            data[localField] = null;
                        }
                        return data;
                    })
                    .toArray(function (err, docs) {
                        if (!err) {
                            result.resolve(docs);
                        } else {
                            result.reject(err);
                        }
                        db.close();

                    });
        } else {
            result.reject(err);
        }
    });
    return result.promise;


}

/** Param 'fields' contains only fields name to return or not 
 * 
 * @param {string} collection
 * @param {object} select
 * @param {object} fields
 * @returns {unresolved}
 */
function _findOneTemplate(collection, select, fields) {
    var result = deferred();
    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(collection);
            table.findOne(select, fields, function (err, docs) {
                if (!err) {
                    result.resolve(docs);
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });
    return result.promise;
}

function _countTemplate(collection, select) {
    var result = deferred();
    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(collection);
            table.find(select).count(function (err, docs) {
                if (!err) {
                    result.resolve(docs);
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });
    return result.promise;
}

function getMenu() {
    return _findTemplate('menu', {}, {fields: {_id: 0, order: 0}, sort: {order: 1}});
}

function getHeadSocials() {
    return _findTemplate('socials',
            {$or: [{'name': "Facebook"}, {name: "Twitter"}, {name: "Instagram"}, {name: "Behance"}]},
            {fields: {_id: 0}}
    );
}

function getSocials() {
    return _findTemplate('socials',
            {name: {$ne: "Instagram"}},
            {fields: {_id: 0}, sort: {_id: 1}}
    );
}

function getHomeFooter() {
    return _findTemplate('homefooterlinks', {}, {fields: {_id: 0}, sort: {_id: 1}});
}

function getServiceOffers() {
    return _findTemplate('about', {}, {fields: {_id: 0, titleBottom: 0, text2: 0, textBig: 0}, sort: {_id: 1}});
}

function getHomePortfolio() {
    return _findTemplate('portfolios', {
        $or: [
            {title: /website design & development/},
            {title: /logo design & branding/},
            {title: /Danielle Heinson Photography Logo Design/},
            {title: /Modern Boudoir Photography Gets a Brand New Website/},
            {title: /Kaytee Ruth Photography Website Design/},
            {title: /Melissa Lyn Photography Logo Design by Media Novak/}
        ]
    }, {fields: {_id: 0}, sort: {type: -1}});
}

function getLatestTestimonials() {
    return _findTemplate('testimonials', {accepted: true}, {fields: {_id: 0, accepted: 0, changed: 0, added: 0, responsible: 0, checked: 0}, sort: {checked: 1, added: -1}, limit: 6});
}

function getLatestBlogposts() {
    return _findTemplate('blogposts', {postDate: {$lte: new Date()}}, {fields: {_id: 0, added: 0, changed: 0, postDate: 0, author: 0}, sort: {added: -1, postDate: -1}, limit: 7});
}

function checkUser(name) {
    if (!name) {
        var result = deferred();
        result.reject('Username not set');
        return result.promise();
    }
    return _findOneTemplate('users', {login: name}, {registered: 0});
}
/** Name is processing offer name
 * 
 * @param {string} name
 * @returns {unresolved}
 */
function getAbout(name) {
    if (!name) {
        var result = deferred();
        result.reject('Name of element is not set');
        return result.promise;
    }
    return _findOneTemplate('about', {titleTop: name}, {name: 0, _id: 0});
}

function getAdminMenu() {
    return _findTemplate('adminmenu', {}, {fields: {_id: 0, order: 0}, sort: {order: 1}});
}

function getContactsCount() {
    return _countTemplate('contacts', {});
}

function getProcessedContactsCount() {
    return _countTemplate('contacts', {processed: true, processStatus: 'Done'});
}

function getFailedContactsCount() {
    return _countTemplate('contacts', {processed: true, processStatus: 'Fail'});
}

function getUnprocessedContactsCount() {
    return _countTemplate('contacts', {processed: false, processStatus: 'Not started'});
}

function getInprocessContactsCount() {
    return _countTemplate('contacts', {processed: false, processStatus: 'In process'});
}

function getTestimonialsCount() {
    return _countTemplate('testimonials', {});
}

function getAcceptedTestimonialsCount() {
    return _countTemplate('testimonials', {accepted: 1});
}

function getUncheckedTestimonialsCount() {
    return _countTemplate('testimonials', {accepted: 0});
}

function getBlogpostsCount() {
    return _countTemplate('blogposts', {});
}

function getPostedBlogpostsCount() {
    return _countTemplate('blogposts', {postDate: {$lte: new Date()}});
}

function getWaitingBlogpostsCount() {
    return _countTemplate('blogposts', {postDate: {$gt: new Date()}});
}

function getQuotesCount() {
    return _countTemplate('quotes', {});
}

function getProcessedQuotesCount() {
    return _countTemplate('quotes', {processed: true, processStatus: 'Done'});
}

function getFailedQuotesCount() {
    return _countTemplate('quotes', {processed: true, processStatus: 'Fail'});
}

function getUnprocessedQuotesCount() {
    return _countTemplate('quotes', {processed: false, processStatus: 'Not started'});
}

function getInprocessQuotesCount() {
    return _countTemplate('quotes', {processed: false, processStatus: 'In process'});
}

function getServicesCount() {
    return _countTemplate('services', {});
}

function getOffersCount() {
    return _countTemplate('offers', {});
}

function getUsersCount() {
    return _countTemplate('users', {});
}

function getSocialsCount() {
    return _countTemplate('users', {});
}

function getQuotesCount() {
    return _countTemplate('quotes', {});
}

function getSubscribedCount() {
    return _countTemplate('subscribed', {});
}

function getTable(name, limit, skip) {
    var options = {};

    if (limit)
        options.limit = limit;
    if (skip)
        options.skip = skip;

    switch (name) {
        case "testimonials":
            options["sort"] = {accepted: 1, added: -1};
            return _aggregateTemplate(name, 'users', 'responsible', '_id', 'name', options);
            break;
        case "contacts":
            options["sort"] = {processed: -1, processStatus: 1, added: -1};
            return _aggregateTemplate(name, 'users', 'responsible', '_id', 'name', options);
            break;
        case "blogposts":
            options["sort"] = {postDate: -1, changed: -1, added: -1};
            return _aggregateTemplate(name, 'users', 'author', '_id', 'name', options);
            break;
        case "about":
            break;
        case "offers":
            break;
        case "users":
            break;
        case "socials":
            break;
        case "quotes":
            options["sort"] = {processed: -1, processStatus: 1, added: -1};
            return _aggregateTemplate(name, 'users', 'responsible', '_id', 'name', options);
            break;
        case "subscribed":
            options["sort"] = {changed: -1, added: -1};
            break;
        default:
            var result = deferred();
            result.reject("Base not available");
            return result.promise();
    }

    return _findTemplate(name, {}, options);
}

function getForEdit(tablename, ID) {
    if (!tablename) {
        var result = deferred();
        result.reject("Tablename not set");
        return result.promise;
    }

    return _findOneTemplate(tablename, {_id: new mongo.ObjectId(ID)});
}

function updateDocument(dataObj) {
    var result = deferred();
    var toUpdate = {};
    var strings = ["testimonial", "fullText", "processComment", "description", "website", "company", "country"];
    var booleans = ["processed", "accepted", "webDesign", "webHosting", "blogDesign", "logoDesign", "completeBranding", "businessCardDesign", "domainName", "stationaryDesign", "eCommerceStore", "active"];

    if (!dataObj.tablename || !dataObj._id) {
        result.reject("Incorrect data");
    }

    _.forEach(dataObj, function (field, key) {
        if (key !== "tablename" && key !== "_id" && field) {
            if (strings.indexOf(key) !== -1) {
                toUpdate[key] = String(field);
            } else if (booleans.indexOf(key) !== -1) {
                toUpdate[key] = (field === "true");
            } else if ((key === "responsible" || key === "author") && field) {
                toUpdate[key] = new mongo.ObjectId(field);
            } else {
                toUpdate[key] = field;
            }
        }
    });

    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(dataObj.tablename);
            table.updateOne({_id: new mongo.ObjectId(dataObj._id)}, {$set: toUpdate}, {upsert: true, multi: false}, function (err, results) {
                if (!err) {
                    result.resolve("Updated");
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });

    return result.promise;
}

function createDocument(dataObj) {
    var result = deferred();
    var toCreate = {};
    var strings = ["testimonial", "fullText", "processComment", "description", "website", "company", "country"];
    var booleans = ["processed", "accepted", "webDesign", "webHosting", "blogDesign", "logoDesign", "completeBranding", "businessCardDesign", "domainName", "stationaryDesign", "eCommerceStore", "active"];

    if (!dataObj.tablename) {
        result.reject("Please, fill all required fields");
    }

    _.forEach(dataObj, function (field, key) {
        if (key !== "tablename" && key !== "_id") {
            if (strings.indexOf(key) !== -1) {
                toCreate[key] = String(field);
            } else if (booleans.indexOf(key) !== -1) {
                toCreate[key] = (field === "true");
            } else if ((key === "responsible" || key === "author") && field) {
                toCreate[key] = new mongo.ObjectId(field);
            } else {
                toCreate[key] = field;
            }
        }
    });

    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(dataObj.tablename);
            table.insertOne(toCreate, function (err, results) {
                if (!err) {
                    result.resolve("Inserted");
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });

    return result.promise;
}

function deleteDocument(tablename, id) {
    var result = deferred();
    var deleteable = ["users", "testimonials", "blogposts", "socials", "contacts", "quotes", "subscribed"];
    var id;

    if (!tablename || !id || deleteable.indexOf(tablename) === -1) {
        result.reject("Incorrect data");
    }

    id = new mongo.ObjectId(id);


    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var table = db.collection(tablename);
            table.remove({_id: id}, {justOne: true}, function (err, results) {
                if (!err) {
                    result.resolve("Element Deleted");
                } else {
                    result.reject(err);
                }
                db.close();
            });
        } else {
            result.reject(err);
        }
    });

    return result.promise;
}

function checkSubscription(dataObj) {
    var result = deferred();
    var exists = _findOneTemplate('subscribed', {email: dataObj.email}, {name: 0, added: 0, changed: 0});

    exists(
            function (data) {
                if (data && data.active) {
                    result.resolve("Already subscribed");
                } else if (data && !data.active) {
                    data.active = true;
                    data.changed = new Date();
                    data.tablename = "subscribed";
                    updateDocument(data)(
                            function (data) {
                                result.resolve("You were subscribed again");
                            },
                            function (error) {
                                result.reject(error);
                            });
                } else {
                    createDocument(dataObj)(
                            function (data) {
                                result.resolve("You were subscribed succesfully");
                            },
                            function (error) {
                                result.reject(error);
                            });
                }
            },
            function (error) {
                console.log(error);
                result.reject(error);
            });

    return result.promise;
}

//function userExists(username) {
//    var user = _findOneTemplate('users', {login: username}, {_id: 0, name: 0, password: 0, registered: 0});
//    var result = deferred();
//
//    user(
//            function (data) {
//                if (!data){
//                    result.resolve({result: "OK"});
//                } else {
//                    result.reject({result: "User exists"});
//                }
//            },
//            function (error) {
//                result.reject({result: "Problem on connecting:" + error});
//            }
//    );
//    
//    return result.promise;
//}

function uniqueExists(data, tablename) {
    var check;
    var result = deferred();

    if (data._id) {
        data._id = {$ne: new mongo.ObjectId(data._id)};
    }

    check = _findOneTemplate(tablename, data);

    check(
            function (data) {
                if (!data) {
                    result.resolve({result: "OK"});
                } else {
                    result.reject({result: "Data exists"});
                }
            },
            function (error) {
                result.reject({result: "Problem on connecting:" + error});
            }
    );

    return result.promise;
}

function getUsers() {
    return _findTemplate('users', {}, {fields: {login: 0, password: 0, registered: 0}, sort: {name: 1}});
}

function getSocialLink(name) {
    if (!name) {
        var result = deferred();
        result.reject('Name of element is not set');
        return result.promise;
    }
    return _findOneTemplate('socials', {name: name}, {_id: 0, class: 0});
}

function getTestimonials(search, limit, skip, sort) {
    sort = sort || {};
    search = search || {};
    if (!limit) {
        var result = deferred();
        result.reject("Incorrect data");
        return result.promise;
    }
    search.accepted = true;
    return _findTemplate('testimonials', search, {fields: {_id: 0, added: 0, changed: 0, accepted: 0, responsible: 0, checked: 0}, sort: sort, limit: limit, skip: skip});
}

exports.getMenu = getMenu;
exports.getHeadSocials = getHeadSocials;
exports.getSocials = getSocials;
exports.getHomeFooter = getHomeFooter;
exports.getServiceOffers = getServiceOffers;
exports.getHomePortfolio = getHomePortfolio;
exports.getLatestTestimonials = getLatestTestimonials;
exports.getLatestBlogposts = getLatestBlogposts;
exports.getAbout = getAbout;
exports.getAdminMenu = getAdminMenu;
exports.getContactsCount = getContactsCount;
exports.getProcessedContactsCount = getProcessedContactsCount;
exports.getFailedContactsCount = getFailedContactsCount;
exports.getInprocessContactsCount = getInprocessContactsCount;
exports.getUnprocessedContactsCount = getUnprocessedContactsCount;
exports.getTestimonialsCount = getTestimonialsCount;
exports.getAcceptedTestimonialsCount = getAcceptedTestimonialsCount;
exports.getUncheckedTestimonialsCount = getUncheckedTestimonialsCount;
exports.getBlogpostsCount = getBlogpostsCount;
exports.getPostedBlogpostsCount = getPostedBlogpostsCount;
exports.getWaitingBlogpostsCount = getWaitingBlogpostsCount;
exports.getQuotesCount = getQuotesCount;
exports.getProcessedQuotesCount = getProcessedQuotesCount;
exports.getFailedQuotesCount = getFailedQuotesCount;
exports.getInprocessQuotesCount = getInprocessQuotesCount;
exports.getUnprocessedQuotesCount = getUnprocessedQuotesCount;
exports.getServicesCount = getServicesCount;
exports.getOffersCount = getOffersCount;
exports.getUsersCount = getUsersCount;
exports.getSocialsCount = getSocialsCount;
exports.getQuotesCount = getQuotesCount;
exports.getSubscribedCount = getSubscribedCount;
exports.getTable = getTable;
exports.checkUser = checkUser;
exports.getForEdit = getForEdit;
exports.createDocument = createDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
//exports.userExists = userExists;
exports.uniqueExists = uniqueExists;
exports.getUsers = getUsers;
exports.getSocialLink = getSocialLink;
exports.checkSubscription = checkSubscription;
exports.getTestimonials = getTestimonials;
exports.mongo = mongo;
