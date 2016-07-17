/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var http = require('http');
var url = require('url');
var cookieSession = require('cookie-session');
var session = cookieSession({
    name: 'medianovaksession',
    secret: "secretkey",
    maxAge: 120 * 60 * 1000
});

function start(route, handlers) {

    function onRequest(request, response) {
        var fullPathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        session(request, response, function(){});
        route(handlers, fullPathname, query, response, request);
    }

    var medianovakserver = http.createServer(onRequest).listen(80);
    console.log("Server is started");
}


exports.start = start;