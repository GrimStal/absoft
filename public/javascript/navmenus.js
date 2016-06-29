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
            link: "/"
        },
        {
            name: "services",
            link: "/website-design",
            children: [
                {
                    name: "website design",
                    link: "/website-design"
                },
                {
                    name: "logo design",
                    link: "/logo-design"
                },
                {
                    name: "branding",
                    link: "/branding"
                }
            ]
        },
        {
            name: "website design",
            link: "/website-design"
        },
        {
            name: "portfolio",
            link: "/portfolio"
        },
        {
            name: "get a quote",
            link: "/get-a-quote"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "testimonials",
            link: "/testimonials"
        },
        {
            name: "contact",
            link: "/contact"
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

_createTemplate("/templates/mobileNavmenu.html", menuObj, mobileMenu);
mobileMenu.then(
        function () {
            _createTemplate("/templates/headerMenu.html", menuObj, headerMenu);
        });
        
$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

