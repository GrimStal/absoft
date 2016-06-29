/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

var html5support = !!document.createElement('video').canPlayType;

var videoReady = $.Deferred();
var offerBox = $.Deferred();
var portfolioBox = $.Deferred();
var testimonialsBox = $.Deferred();
var blogpostsBox = $.Deferred();
var footerBox = $.Deferred();

var offerBoxObj = {
    services: [
        {
            name: "website design",
            link: "/website-design-portfolio",
            description: "Plenty of folks think that web design " +
                    "is all about slapping some words and pictures" +
                    "together and posting them online. No doubt that..."
        },
        {
            name: "logo design",
            link: "/logo-design-portfolio",
            description: "MediaNovak has taken what was once a " +
                    "long, expensive process and turned it into an " +
                    "easy, even fun experience. With a little input..."
        },
        {
            name: "branding",
            link: "/branding",
            description: "A brand isn’t just a pretty logo, engaging " +
                    "website or strategic marketing plan. It is a " +
                    "deliberate, cohesive message. A story. An idea and..."
        }
    ]
};

var portfolioObj = {
    rows: [
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
                            link: "/web-design-portfolio/"
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
                            link: "/danielle-heinson-photography-logo-design/",
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
                            link: "/modern-boudoir-photography-website-design/",
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
                            link: "/kaytee-ruth-photography-website-design/",
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
                            link: "/melissa-lyn-photography-logo-design/",
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
                            link: "/logo-design-portfolio/"
                        }
                    ]
                }
            ]
        }
    ]
};

var testimonialsObj = {testimonials: [
        {
            name: "Chantal Lachance-Gibson Photography",
            testimonial: "I had been following Media Novak’s " +
                    "work for a while now and was always impressed " +
                    "with their logo work. The logo designs they came " +
                    "up with based on my wishes for what I wanted it to " +
                    "look like were above and beyond what I had imagined. " +
                    "The process itself was smooth and so easy. I gave input " +
                    "and they took it on board and applied it to the next design. " +
                    "I would highly recommend them any day!",
            link: "/content/sources/testimonials/chantal-testimonial.jpg",
            alt: "chantal-testimonial"
        },
        {
            name: "Myrick Cowart – Photographer",
            testimonial: "I cannot begin to say enough about Mark & the team at Media Novak. " +
                    "Their customer service has been TOP NOTCH! They have gone way beyond " +
                    "my expectations and dreams and have put together a website for me that I " +
                    "am so proud of… I actually can’t believe that it’s mine! If you are looking " +
                    "for a new website or new branding then look no further… contact these guys today!",
            link: "/content/sources/testimonials/myrick-testimonial.jpg",
            alt: "myrick-testimonial"
        },
        {
            name: "Bethany Petersen – Photographer",
            testimonial: "Thank you thank you thank you! I really appreciate all of your help " +
                    "and your quick replies and editing, and well, everything. I will DEFINITELY be " +
                    "referring your team! I love my new logo and I love that it is completely my own and " +
                    "completely encompasses my brand. I really appreciate all of the time and effort your " +
                    "team has put into this project. Thank you again and again!",
            link: "/content/sources/testimonials/bethany-petersen-testimonial.jpg",
            alt: "bethany-petersen-testimonial"
        },
        {
            name: "Karen McGowran – Photographer",
            testimonial: "I decided to hire Media Novak after seeing a friends logo that I really " +
                    "liked. I sent them my ideas but I actually preferred one of their original " +
                    "concepts over my own ideas! They really understood the look and feel I was " +
                    "trying to achieve and I am delighted with my new logo! I found the process to " +
                    "be really enjoyable and smooth and emails were answered very quickly… a big " +
                    "thumbs up from me!",
            link: "/content/sources/testimonials/karen-mcgowran-testimonial.jpg",
            alt: "karen-mcgowran-testimonial"
        },
        {
            name: "Jo-Ann Stokes – Photographer",
            testimonial: "Media Novak were helpful and listened to me as the client… never once " +
                    "tried to push their likes onto me… but they do offer good advice. I think " +
                    "what has mattered most to me was once we went live, they were very much still " +
                    "around to iron out little problems that only became noticeable to myself with the " +
                    "daily running of a website and a blog! I would highly recommend them to other " +
                    "businesses!",
            link: "/content/sources/testimonials/jo-ann-testimonial.jpg",
            alt: "jo-ann-testimonial"
        },
        {
            name: "Renee Zona – Photographer",
            testimonial: "Media Novak designed a beautiful website for me and I’m very satisfied " +
                    "with it. They listened to what I wanted and tailored the site to fit me and " +
                    "I really appreciate that. Their prices are reasonable and the quality is " +
                    "fantastic. I would highly recommend this company.",
            link: "/content/sources/testimonials/renee-testimonial.jpg",
            alt: "renee-testimonial"
        }
    ]};

var blogpostsObj = {
    blogs: [
        {
            image: "photography-business-stationery-items",
            link: "/photography-business-stationery-items/",
            aText: "Photography Business Stationery Items | Print Isn’t Dead! How To Get More Business From Your Stationery",
            fullText: "Photography Business Stationery Items | Let's take a moment to thank the inventors of the Internet for one of the fiercest inventions of our time! Think about it - whether…"
        },
        {
            image: "photography-logo-rules",
            link: "/photography-business-stationery-items/",
            aText: "Photography Logo Rules | The 5 Most Important Things Photographers Need To Know About Designing A Logo",
            fullText: ""
        },
        {
            image: "creative-photography-marketing",
            link: "/creative-photography-marketing/",
            aText: "Creative Photography Marketing | Sizzling Hot Marketing Tips To Boost Your Photography Business This Summer",
            fullText: ""
        },
        {
            image: "photography-website-seo-essentials",
            link: "/photography-website-seo-essentials/",
            aText: "Photography Website SEO Essentials | How To Get Discovered (And Hired!) – The Photographer’s Guide To SEO",
            fullText: ""
        },
        {
            image: "photography-branding-questions",
            link: "/photography-branding-questions/",
            aText: "Photography Branding Questions | Discover The Identity Of Your Photography Business – 5 Questions To Get You Started",
            fullText: ""
        },
        {
            image: "professional-photography-questions-answered",
            link: "/professional-photography-questions-answered/",
            aText: "Professional Photography Questions Answered | How To Create Photography Packages That Sell? – And Other Difficult Questions Pro Photographers Face",
            fullText: ""
        },
        {
            image: "business-card-expert-design-advice",
            link: "/business-card-expert-design-advice/",
            aText: "Business Card Expert Design Advice | 5 Simple Ways To Add Punch To Your Business Card!",
            fullText: ""
        }
    ]
};

var footerObj = {
    logo: {
        link: '/contact/',
        title: 'MediaNovak Homepage',
        imgLink: '/content/sources/connect-with-us.png',
        imgAlt: 'MediaNovak Logo'
    },
    items: [
        {
            type: "page",
            name: "Home",
            link: "/"
        },
        {
            type: "page",
            name: "About us",
            link: "/about/"
        },
        {
            type: "custom",
            name: "Services",
            link: "/portfolio/"
        },
        {
            type: "page",
            name: "Website design",
            link: "/website-design/"
        },
        {
            type: "page",
            name: "Portfolio",
            link: "/portfolio/"
        },
        {
            type: "page",
            name: "Get a quote",
            link: "/get-a-quote/"
        },
        {
            type: "page",
            name: "Blog",
            link: "/blog/"
        },
        {
            type: "page",
            name: "Contact",
            link: "/contact/"
        }      
    ],
    socials: [
        {
            name: "Facebook",
            link: "https://www.facebook.com/MediaNovak",
            class: "fa-facebook"
        },
        {
            name: "Twitter",
            link: "https://twitter.com/medianovak",
            class: "fa-twitter"
        },
        {
            name: "Google+",
            link: "https://plus.google.com/u/0/+MarkStokesMediaNovak/posts",
            class: "fa-google-plus"
        },
        {
            name: "Pinterest",
            link: "http://www.pinterest.com/medianovak",
            class: "fa-pinterest"
        },
        {
            name: "LinkedIn",
            link: "http://www.linkedin.com/profile/view?id=196919203",
            class: "fa-linkedin"
        },
        {
            name: "Behance",
            link: "https://www.behance.net/MediaNovak",
            class: "fa-behance"
        },
        {
            name: "Dribbble",
            link: "https://dribbble.com/MediaNovak",
            class: "fa-dribbble"
        },
        {
            name: "YouTube",
            link: "https://www.youtube.com/user/MediaNovakCom",
            class: "fa-youtube"
        }
    ]
};

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

headerMenu.then(
        function () {
            _createTemplate("/templates/serviceoffer.html", offerBoxObj, offerBox);
        });

offerBox.then(
        function () {
            _createTemplate("/templates/portfoliosection.html", portfolioObj, portfolioBox);
        });

portfolioBox.then(
        function () {
            _createTemplate("/templates/testimonialssection.html", testimonialsObj, testimonialsBox);
        });

testimonialsBox.then(
        function () {
            _createTemplate("/templates/blogpostssection.html", blogpostsObj, blogpostsBox);
        });
        
blogpostsBox.then(
        function(){
            _createTemplate("/templates/footer.html", footerObj, footerBox);
        });

$.when(videoReady, blogpostsBox, testimonialsBox, portfolioBox, offerBox, headerMenu, mobileMenu).always(
        function () {
            parallaxInit();
            fixParallax();
            $(".loader").remove();
        });

