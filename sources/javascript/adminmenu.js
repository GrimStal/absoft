/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";
function viewChangesTable(obj) {
    $('#contacts-row .total').text(obj.contactsTotal);
    $('#contacts-row .ready').text(obj.processedContacts);
    $('#contacts-row .failed').text(obj.failedContacts);
    $('#contacts-row .inprocess').text(obj.inprocessContacts);
    $('#contacts-row .unprocessed').text(obj.unprocessedContacts);
    $('#testimonials-row .total').text(obj.testimonialsTotal);
    $('#testimonials-row .ready').text(obj.acceptedTestimonials);
    $('#testimonials-row .unchecked').text(obj.uncheckedTestimonials);
    $('#blogposts-row .total').text(obj.blogpostsTotal);
    $('#blogposts-row .ready').text(obj.postedBlogposts);
    $('#blogposts-row .waiting').text(obj.waitingBlogposts);
}

function viewChanges(obj) {
    var contacts = (obj.unprocessedContacts === 0 ? "" : obj.unprocessedContacts);
    var testimonials = (obj.uncheckedTestimonials === 0 ? "" : obj.uncheckedTestimonials);
    var blogposts = (obj.waitingBlogposts === 0 ? "" : obj.waitingBlogposts);
    $('#to-contact-left-menu .badge').text(contacts);
    $('#testimonials-left-menu .badge').text(testimonials);
    $('#blogposts-left-menu .badge').text(blogposts);
}

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

