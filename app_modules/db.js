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

function _findTemplate(collection, select, options) {
    var result = deferred();
    mongoClient.connect(connectStr, function (err, db) {
        if (!err) {
            var menu = db.collection(collection);
            menu.find(select, options).toArray(function (err, docs) {
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
    return _findTemplate('offers', {}, {fields: {_id:0}, sort: {_id: 1}});
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
    }, {fields: {_id:0}, sort: {type:-1}});
}

function getLatestTestimonials() {
    return _findTemplate('testimonials', {accepted: true}, {fields: {_id:0, accepted: 0}, sort: {_id: -1}, limit: 6});
}

function getLatestBlogposts() {
    return _findTemplate('blogposts', {}, {fields: {_id:0}, sort: {_id: -1}, limit: 7});
}

exports.getMenu = getMenu;
exports.getHeadSocials = getHeadSocials;
exports.getSocials = getSocials;
exports.getHomeFooter = getHomeFooter;
exports.getServiceOffers = getServiceOffers;
exports.getHomePortfolio = getHomePortfolio;
exports.getLatestTestimonials = getLatestTestimonials;
exports.getLatestBlogposts = getLatestBlogposts;
