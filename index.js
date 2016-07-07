/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var server = require('./app_modules/server');
var router = require('./app_modules/router');
var requestHandlers = require('./app_modules/requestHandlers');

var handle = {};
handle["/"] = requestHandlers.home;
handle["/home"] = requestHandlers.home;
handle["/home/"] = requestHandlers.home;
handle["/website-design"] = requestHandlers.websiteDesign;
handle["/website-design/"] = requestHandlers.websiteDesign;
handle["/logo-design"] = requestHandlers.logoDesign;
handle["/logo-design/"] = requestHandlers.logoDesign;
handle["/branding"] = requestHandlers.branding;
handle["/branding/"] = requestHandlers.branding;
handle["/portfolio"] = requestHandlers.portfolio;
handle["/portfolio/"] = requestHandlers.portfolio;
handle["/adminpage"] = requestHandlers.adminpage;
handle["/adminpage/"] = requestHandlers.adminpage;
handle["/adminpage/checkupdates"] = requestHandlers.checkUpdates;
handle["/adminpage/testimonials"] = requestHandlers.adminTestimonials;
handle["/adminpage/testimonials/"] = requestHandlers.adminTestimonials;
handle["/adminpage/to-contact"] = requestHandlers.adminContacts;
handle["/adminpage/to-contact/"] = requestHandlers.adminContacts;
handle["/unknown"] = requestHandlers.unknown;
handle["/unknown/"] = requestHandlers.unknown;
handle["upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);