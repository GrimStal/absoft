/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

function getChanges() {
    $.ajax({
        url: "/adminpage/checkupdates",
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function(obj){
            viewChanges(obj);
            viewChangesTable(obj);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

getChanges();
setInterval(getChanges, 5000);
