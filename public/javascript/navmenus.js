/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
(function () {
    "use strict";

    var menuTemplate;
    var mobileTemplate;

    var mobileMenu = $.Deferred();
    var headerMenu = $.Deferred();

    mobileMenu = $.ajax({
        url: "./templates/mobileNavmenu.html",
        method: "GET",
        async: true,
        success: function (data) {
            var html = '';
            mobileTemplate = _.template(data);
            html += mobileTemplate({
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
            });
            $(document.body).append(html);
        }
    });

    headerMenu = $.ajax({
        url: "./templates/headerMenu.html",
        method: "GET",
        async: true,
        success: function (data) {
            var html = '';
            menuTemplate = _.template(data);
            html += menuTemplate({
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
            });
            $(document.body).append(html);
        }
    });
    
    $(document).scroll(function(e){
        var top = $(document).scrollTop();
        if (top > 0){
            $("header").addClass('sticky');
        } else {
            $("header").removeClass('sticky');
        }
    });
})();
