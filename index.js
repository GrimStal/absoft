/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var server = require('./app_modules/server');
var router = require('./app_modules/router');
var requestHandlers = require('./app_modules/requestHandlers');

function handle(handler, link, reqHandler, func){
    if (link.slice(-1) !== "/"){
        handler[link] = reqHandler[func];
        handler[link + "/"] = handler[link];
    }else{
         handler[link] = reqHandler[func];
         handler[link.slice(0,-1)] = reqHandler[func];
    }
}

var uHandle = {};
handle(uHandle, "/", requestHandlers, "home");
handle(uHandle, "/home", requestHandlers, "home");
handle(uHandle, "/website-design", requestHandlers, "websiteDesign");
handle(uHandle, "/logo-design", requestHandlers, "logoDesign");
handle(uHandle, "/branding", requestHandlers, "branding");
handle(uHandle, "/portfolio", requestHandlers, "portfolio");
handle(uHandle, "/contact", requestHandlers, "contactUs");
handle(uHandle, "/contact/leavemessage", requestHandlers, "leavemessage");
handle(uHandle, "/unknown", requestHandlers, "unknown");
handle(uHandle, "/authorization", requestHandlers, "authorization");
handle(uHandle, "/checklogin", requestHandlers, "checkLogin");
handle(uHandle, "/logout", requestHandlers, "logout");
uHandle["/upload"] = requestHandlers.upload;
uHandle["/show"] = requestHandlers.show;

var aHandle = {};
handle(aHandle, "/adminpage", requestHandlers, "adminpage");
handle(aHandle, "/adminpage/checkupdates", requestHandlers, "checkUpdates");
handle(aHandle, "/adminpage/testimonials", requestHandlers, "adminTestimonials");
handle(aHandle, "/adminpage/to-contact", requestHandlers, "adminContacts");
handle(aHandle, "/adminpage/blogposts", requestHandlers, "adminBlogposts");
handle(aHandle, "/adminpage/services", requestHandlers, "adminServices");
handle(aHandle, "/adminpage/what-we-offer", requestHandlers, "adminOffers");
handle(aHandle, "/adminpage/users", requestHandlers, "adminUsers");
handle(aHandle, "/adminpage/socials", requestHandlers, "adminSocials");
handle(aHandle, "/adminpage/edit", requestHandlers, "adminEdit");
handle(aHandle, "/adminpage/delete", requestHandlers, "adminDeleteData");
handle(aHandle, "/adminpage/editdata", requestHandlers, "adminEditData");
//handle(aHandle, "/adminpage/userexists", requestHandlers, "userExist");
handle(aHandle, "/adminpage/uniqueexists", requestHandlers, "uniqueExist");

server.start(router.route, [uHandle, aHandle]);
