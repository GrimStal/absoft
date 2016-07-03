/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

var html5support = !!document.createElement('video').canPlayType;

var videoReady = $.Deferred();

function parallaxInit() {

    $(document).ready(function () {
        $('#testimonials').parallax();
    });

    $("#carousel-example-generic .carousel-inner > .item:first").addClass("active");
    $("#carousel-example-generic").on(
            {
                'slid.bs.carousel': function (e) {
                    $(".parallax-mirror").height($("#testimonials .overlay").height());
                }
            }
    );
}

function fixParallax() {
    $(window).trigger("scroll").trigger("resize");
}

$("head title").text("MediaNovak - Photography Websites & Logo Design");

if (!html5support) {
    videoReady.resolve();
} else {
    $("#video-background").on({
        'loadeddata': function () {
            videoReady.resolve();
        },
        'error': function () {
            videoReady.reject();
        }
    });
}

$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

videoReady.always(
        function () {
            parallaxInit();
            fixParallax();
            $(".loader").remove();
        });

