/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;

        console.log(new Date().toTimeString() + " | Request for " + pathname + " recieved");
        route(handle, pathname, response, request);

    }

    http.createServer(onRequest).listen(8888);

    console.log("Server is started");
}

exports.start = start;