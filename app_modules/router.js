/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
function route(handle, pathname, query, response, request) {
    var pathname = pathname;

    if (typeof handle[pathname] === "function") {
        return handle[pathname](response, request, query, pathname);
    } else {
        return handle["/unknown"](response, request, pathname);
    }

}

exports.route = route;