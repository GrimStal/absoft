/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
function route(handle, pathname){
    if (typeof handle[pathname] !== "function"){
        console.log("No handler for current pathname: " + pathname);
    } else {
        handle[pathname]();
    }
}

exports.route = route;