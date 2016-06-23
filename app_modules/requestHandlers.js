/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
var fs = require("fs");
var formidable = require("formidable");

function _getResponse(request, response, type) {
    return fs.readFile("public/" + request.url, function (error, data) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error);
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": type});
            response.write(data);
            response.end();
        }
    });
}

function home(response, request) {
    console.log("Home action");

    fs.readFile("public/index.html", function (error, data) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error);
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        }
    });
}

function unknown(response, request) {
    if (request.url.indexOf(".css") !== -1) {
        _getResponse(request, response, "text/css");
    } else if (request.url.indexOf(".js") !== -1) {
        _getResponse(request, response, "text/javascript");
    } else if (request.url.indexOf(".html") !== -1) {
        _getResponse(request, response, "text/html");
    } else if (request.url.indexOf(".png") !== -1 || request.url.indexOf(".gif") !== -1
            || request.url.indexOf(".ico") !== -1) {
        _getResponse(request, response, "image");
    } else if (request.url.indexOf(".mp4") !== -1) {
        _getResponse(request, response, "video");
    } else {
        console.log("Unknown handler:");
        fs.readFile("public/nf.html", function (error, data) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error);
            response.end();
        } else {
            response.writeHead(404, {"Content-Type": "text/html"});
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

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("recieved image: <br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request) {
    console.log("Show action");
    fs.readFile("public/content/sources/logo.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.home = home;
exports.upload = upload;
exports.show = show;
exports.unknown = unknown;
