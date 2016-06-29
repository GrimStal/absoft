/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
"use strict";
var mobileMenu = $.Deferred();
var headerMenu = $.Deferred();
var menuObj = {
    menus: [
        {
            name: "home",
            link: "http://localhost:8888"
        },
        {
            name: "services",
            link: "http://localhost:8888/website-design",
            children: [
                {
                    name: "website design",
                    link: "http://localhost:8888/website-design"
                },
                {
                    name: "logo design",
                    link: "http://localhost:8888/logo-design"
                },
                {
                    name: "branding",
                    link: "http://localhost:8888/branding"
                }
            ]
        },
        {
            name: "website design",
            link: "http://localhost:8888/website-design"
        },
        {
            name: "portfolio",
            link: "http://localhost:8888/portfolio"
        },
        {
            name: "get a quote",
            link: "http://localhost:8888/get-a-quote"
        },
        {
            name: "blog",
            link: "http://localhost:8888/blog"
        },
        {
            name: "testimonials",
            link: "http://localhost:8888/testimonials"
        },
        {
            name: "contact",
            link: "http://localhost:8888/contact"
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
            name: "Instagram",
            link: "https://www.instagram.com/media_novak/",
            class: "fa-instagram"
        },
        {
            name: "Behance",
            link: "https://www.behance.net/MediaNovak",
            class: "fa-behance"
        }
    ]
};
/** Returns template into DOM
 * 
 * @param {string} link
 * @param {object} templateData
 * @param {object} def
 * @param {function} cb
 * @returns {jqXHR}
 */
function _createTemplate(link, templateData, def, cb) {
    var html = '';
    var template;
    if (!link || !templateData || !def) {
        return false;
    }

    return $.ajax({
        url: link,
        method: "GET",
        async: true,
        success: function (data) {
            template = _.template(data);
            html += template(templateData);
            $(document.body).append(html);
            if (cb && typeof cb === 'function')
                cb();
            def.resolve();
        }
    });
}

_createTemplate("http://localhost:8888/templates/mobileNavmenu.html", menuObj, mobileMenu);
mobileMenu.then(
        function () {
            _createTemplate("http://localhost:8888/templates/headerMenu.html", menuObj, headerMenu);
        });
$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

