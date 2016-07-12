/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
function route(handlers, pathname, query, response, request) {
    var pathname = pathname;
    var uHandle = handlers[0];
    var aHandle = handlers[1];

    switch (pathname.split("/")[1]) {
        case "adminpage":
            if (typeof aHandle[pathname] === "function") {
                if (request.session.authorized) {
                    return aHandle[pathname](response, request, query, pathname);
                } else {
                    return uHandle["/authorization"](response, request, query, pathname);
                }
            } else {
                return uHandle["/unknown"](response, request, pathname);
            }
            break;
        default:
            if (typeof uHandle[pathname] === "function") {
                return uHandle[pathname](response, request, query, pathname);
            } else {
                return uHandle["/unknown"](response, request, pathname);
            }
    }

}

exports.route = route;