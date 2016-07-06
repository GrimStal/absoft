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
        },
        error: function (data) {
            console.log(data);
        }
    });
}

var page = $(".pagination .active a").text();

if (page && page == 1){
    $(".pagination ul li:first-child").addClass("disabled");
} else if (page && page == $(".pagination ul li:nth-last-child(2) a").text()){
    $(".pagination ul li:last-child").addClass("disabled");
}

getChanges();
setInterval(getChanges, 5000);
