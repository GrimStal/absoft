/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
"use strict";

/** Returns template into DOM
 * 
 * @param {string} link
 * @param {object} templateData
 * @param {object} def
 * @param {function} cb
 * @returns {jqXHR}
 */
        
$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

$("#carousel-example-generic .carousel-inner > .item:first").addClass("active");

