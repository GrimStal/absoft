/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;
        route(handle, pathname, query, response, request);
    }

    http.createServer(onRequest).listen(8888);

    console.log("Server is started");
}

exports.start = start;