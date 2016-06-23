/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
function route(handle, pathname, response, request) {
    if (typeof handle[pathname] !== "function") {
        return handle["/unknown"](response, request);
    } else {
        return handle[pathname](response, request);
    }

}

exports.route = route;