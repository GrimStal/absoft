/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

var $container = $('.clients-review-wrapper');
// initialize

$container.masonry({
    columnWidth: 0,
    itemSelector: '.item',
    gutter: 10

});

var sticky = new Waypoint.Sticky({
  element: $('.sticky-element')[0]
});
