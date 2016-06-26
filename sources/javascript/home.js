/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
(function () {
    "use strict";

    var offerTemplate;
    var portfolioTemplate;
    var html5support = !!document.createElement('video').canPlayType;

    var videoReady = $.Deferred();
    var offerBox = $.Deferred();
    var portfolioBox = $.Deferred();


    videoReady.always(
            function () {
                $(".loader").remove();
            });

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
    
    portfolioTemplate = $.ajax({
        url: "./templates/portfoliosection.html",
        method: "GET",
        async: true,
        success: function (data) {
            var html = '';
            portfolioTemplate = _.template(data);
            html += portfolioTemplate({
                rows : [
                    {
                        elements: [
                            {
                                proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                                els: [
                                    {
                                        type: "holder txt",
                                        classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-right-large border-bottom-medium border-bottom-small",
                                        img: ["fix1.png", "fix2.png"],
                                        title: "website design & development",
                                        longText: "Plenty of folks think that web design is all about slapping some words and pictures together and posting them online. No doubt that sort of attitude has created some of the atrocious and non-working web sites we see...",
                                        shortTextM: "Plenty of folks think that web design is all about slapping some words and pictures together and posting them online.",
                                        shortTextS: "Plenty of folks think that web design is all about...",
                                        link: "./web-design-portfolio/"
                                    }
                                ]
                            },
                            {
                                proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                                els: [
                                    {
                                        type: "holder portfolio",
                                        classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-right-large border-bottom-medium border-bottom-small border-right-medium",
                                        img: ["danielle-heinson-photography-logo-design-concept-1-1200x650.jpg"],
                                        imgClass: "attachment-portfolio-large size-portfolio-large wp-post-image",
                                        title: "Danielle Heinson Photography Logo Design",
                                        sizes: "(max-width: 1200px) 100vw, 1200px",
                                        shortTextM: "Check out the new logo we designed for Danielle Heinson Photography! “Media Novak has been incredible! I knew I wanted to hire them when I…",
                                        shortTextS: "Check out the new logo we designed for Danielle Heinson…",
                                        link: "./danielle-heinson-photography-logo-design/",
                                        outerLinks: [
                                            "https://medianovak.com/projects/danielle-heinson-photography-logo-design/",
                                            "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/danielle-heinson-photography-logo-design/",
                                            "https://twitter.com/home?status=https://medianovak.com/projects/danielle-heinson-photography-logo-design/"
                                        ]
                                    },
                                    {
                                        type: "holder portfolio",
                                        classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem half-elem border-bottom-medium border-bottom-small",
                                        img: ["modern-boudoir-photography-website-design-media-novak-4-1200x650.jpg"],
                                        imgClass: "attachment-portfolio-large size-portfolio-large wp-post-image",
                                        title: "Modern Boudoir Photography Gets a Brand New Website",
                                        sizes: "(max-width: 1200px) 100vw, 1200px",
                                        shortTextM: " ",
                                        shortTextS: " ",
                                        link: "./modern-boudoir-photography-website-design/",
                                        outerLinks: [
                                            "https://medianovak.com/projects/modern-boudoir-photography-website-design/",
                                            "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/modern-boudoir-photography-website-design/",
                                            "https://twitter.com/home?status=https://medianovak.com/projects/modern-boudoir-photography-website-design/"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        elements: [
                            {
                                proportions: "col-xs-12 col-sm-12 col-md-8 col-lg-9",
                                els: [
                                    {
                                        type: "holder portfolio",
                                        classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                        img: ["kaytee-ruth-photography-website-design-11-1200x650.jpg"],
                                        imgClass: "attachment-portfolio-large size-portfolio-large wp-post-image",
                                        title: "Kaytee Ruth Photography Website Design",
                                        sizes: "(max-width: 1200px) 100vw, 1200px",
                                        shortTextM: "I am so thankful for MediaNovak!! My experience with them was more than exceptional and the whole process was stress free for me! Everything was delivered in a timely manner and if it wasn’t, it was my fault! What they have created for my business is “hit the nail on the head” what I wanted […]",
                                        shortTextS: "I am so thankful for MediaNovak!! My experience with them…",
                                        link: "./kaytee-ruth-photography-website-design/",
                                        outerLinks: [
                                            "https://medianovak.com/projects/kaytee-ruth-photography-website-design/",
                                            "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/kaytee-ruth-photography-website-design/",
                                            "https://twitter.com/home?status=https://medianovak.com/projects/kaytee-ruth-photography-website-design/"
                                        ]
                                    },
                                    {
                                        type: "holder portfolio",
                                        classes: "col-xs-6 col-sm-6 col-md-6 col-lg-6 elem third-elem border-top-large border-right-large border-right-medium border-bottom-small",
                                        img: ["melissa-lyn-photography-logo-design-media-novak-1-1200x650.jpg"],
                                        imgClass: "attachment-portfolio-large size-portfolio-large wp-post-image",
                                        title: "Melissa Lyn Photography Logo Design by Media Novak",
                                        sizes: "(max-width: 1200px) 100vw, 1200px",
                                        shortTextM: "Check out the new logo we created for Melissa Lyn Photography! “So far, I am very impressed with Mark & his design team! I was nervous about hiring someone to create a new logo and website for my business, especially when I didn’t know exactly what I wanted. Mark was very quick to respond to […]",
                                        shortTextS: "Check out the new logo we created for Melissa Lyn…",
                                        link: "./melissa-lyn-photography-logo-design/",
                                        outerLinks: [
                                            "https://medianovak.com/projects/melissa-lyn-photography-logo-design/",
                                            "https://www.facebook.com/sharer/sharer.php?u=https://medianovak.com/projects/melissa-lyn-photography-logo-design/",
                                            "https://twitter.com/home?status=https://medianovak.com/projects/melissa-lyn-photography-logo-design/"
                                        ]
                                    }
                                ]
                            },
                            {
                                proportions: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
                                els: [
                                    {
                                        type: "holder txt",
                                        classes: "col-xs-12 col-sm-12 col-md-12 col-lg-12 elem text-holder-elem border-top-large border-top-medium",
                                        img: ["fix3.png", "fix2.png"],
                                        title: "Logo Design & Branding",
                                        longText: "MediaNovak has taken what was once a long, expensive process and turned it into an easy, even fun experience. With a little input from you about your company, our professional logo designers will provide you with a great-looking...",
                                        shortTextM: "MediaNovak has taken what was once a long, expensive process and turned it into an easy, even fun experience.",
                                        shortTextS: "MediaNovak has taken what was once a long, expensive process...",
                                        link: "./logo-design-portfolio/"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            $(document.body).append(html);
        }
    });

})();
