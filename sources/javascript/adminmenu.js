/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

$('.has-children').on({
    'click': function (event) {
        event = event || window.event;
        var $target = $(event.currentTarget).find("span.glyphicon");
        if ($target.hasClass("glyphicon-menu-down")) {
            $target.removeClass("glyphicon-menu-down");
            $target.addClass("glyphicon-menu-up");
        } else if ($target.hasClass("glyphicon-menu-up")) {
            $target.removeClass("glyphicon-menu-up");
            $target.addClass("glyphicon-menu-down");
        }
    }
});
