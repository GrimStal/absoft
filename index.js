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
handle["/unknown"] = requestHandlers.unknown;
handle["upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);