/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
"use strict";

var mobileMenu = $.Deferred();
var headerMenu = $.Deferred();

var menuObj = {
    menus: ["home",
        {
            name: "services",
            link: "./website-design",
            children: [
                "website design",
                "logo design",
                "branding"
            ]
        },
        "website design",
        "portfolio",
        "get a quote",
        "blog",
        "testimonials",
        "contact"]
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

_createTemplate("./templates/mobileNavmenu.html", menuObj, mobileMenu);

mobileMenu.then(
        function () {
            _createTemplate("./templates/headerMenu.html", menuObj, headerMenu);
        });

$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

