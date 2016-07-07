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

getChanges();
setInterval(getChanges, 5000);

$.map($('.testimonial p, .link p, .fullText p, .image p, .text1 p, .text2 p, .textBig p, .items p'),function(elem){
    $(elem).attr('data-toggle', 'tooltip');
    $(elem).attr('data-placement', 'bottom');
    $(elem).attr('data-trigger', 'hover focus click');
    $(elem).attr('title', $(elem).text());
});

$.map($('tbody tr:last-child .testimonial p, tbody tr:last-child .link p'),function(elem){
   $(elem).attr('data-placement', 'top');
});

$("[data-toggle='tooltip']").tooltip(); 
