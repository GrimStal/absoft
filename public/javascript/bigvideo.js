/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
(function () {
    "use strict";

    var offerTemplate;
    var html5support = !!document.createElement('video').canPlayType;
    
    var videoReady = $.Deferred();
    var offerBox = $.Deferred();

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

    $.when(videoReady).always(
            function () {
                $(".loader").remove();
            });

    offerBox = $.ajax({
        url: "./templates/serviceoffer.html",
        method: "GET",
        async: true,
        success: function (data) {
            var html = '';
            offerTemplate = _.template(data);
            html += offerTemplate({
                services: [
                    {
                        name: "website design",
                        link: "./website-design-portfolio",
                        description: "Plenty of folks think that web design " +
                                "is all about slapping some words and pictures" +
                                "together and posting them online. No doubt that..."
                    },
                    {
                        name: "logo design",
                        link: "./logo-design-portfolio",
                        description: "MediaNovak has taken what was once a " +
                                "long, expensive process and turned it into an " + 
                                "easy, even fun experience. With a little input..."
                    },
                    {
                        name: "branding",
                        link: "./branding",
                        description: "A brand isn’t just a pretty logo, engaging " + 
                                "website or strategic marketing plan. It is a " + 
                                "deliberate, cohesive message. A story. An idea and..."
                    } 
                ]
            });
            $(document.body).append(html);
        }
    });

})();
