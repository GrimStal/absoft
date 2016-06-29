/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
function route(handle, pathname, response, request) {
    var pathname = pathname;

    if (typeof handle[pathname] === "function") {
        return handle[pathname](response, request);
    } else {
        return handle["/unknown"](response, request);
    }

}

exports.route = route;