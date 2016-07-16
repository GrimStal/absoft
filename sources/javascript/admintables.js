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

$.map($('.testimonial p, .link p, .fullText p, .image p, .imageSmall p, .text1 p, .text2 p, .textBig p, .items p, .description p, .describe p'),function(elem){
    $(elem).attr('data-toggle', 'tooltip');
    $(elem).attr('data-placement', 'bottom');
    $(elem).attr('data-trigger', 'hover focus click');
    $(elem).attr('title', $(elem).text());
});

$.map($('tbody tr:last-child .testimonial p, ' + 
        'tbody tr:last-child .link p, tbody tr:last-child .fullText p, ' + 
        'tbody tr:last-child .image p, tbody tr:last-child .imageSmall p, ' + 
        'tbody tr:last-child .text1 p, tbody tr:last-child .text2 p, ' + 
        'tbody tr:last-child .textBig p, tbody tr:last-child .items p, ' + 
        'tbody tr:last-child .description p, tbody tr:last-child .describe p'),function(elem){
   $(elem).attr('data-placement', 'top');
});

$("[data-toggle='tooltip']").tooltip(); 

