/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var deferred = require('deferred');
var mongoClient = require('mongodb').MongoClient;
var host = 'localhost';
var port = '27017';
var login = "medianovak";
var password = "1zaBEtcVmv";
var dataBase = "medianovak";
var connectStr = "mongodb://" + login + ":" + password + "@" + host + ":" + port + "/" + dataBase;

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
    return _findTemplate('offers', {}, {fields: {_id: 0}, sort: {_id: 1}});
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
    return _findTemplate('testimonials', {accepted: 1}, {fields: {_id: 0, accepted: 0, changed: 0, added: 0, responsible: 0, checked: 0}, sort: {checked: 1, added: -1}, limit: 6});
}

function getLatestBlogposts() {
    return _findTemplate('blogposts', {postDate: {$lte: new Date()}}, {fields: {_id: 0, added: 0, changed: 0, postDate: 0, author: 0}, sort: {added: -1, postDate: -1}, limit: 7});
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
    return _findOneTemplate('about', {name: name}, {name: 0, _id: 0});
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

function getTable(name, limit, skip) {
    var options = {};

    if (limit)
        options.limit = limit;
    if (skip)
        options.skip = skip;

    switch (name) {
        case "testimonials":
            options["sort"] = {accepted: 1, added: -1};
            break;
        case "contacts":
            options["sort"] = {processed: -1, processStatus: 1, requestDate: -1};
            break;
        case "blogposts":
            options["sort"] = {postDate: -1, changed: -1, added: -1};
            break;
        default:
            var result = deferred();
            result.reject("Base not available");
            return result.promise();
    }

    return _findTemplate(name, {}, options);
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
exports.getTable = getTable;
