/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
(function () {
    "use strict";

    var menuTemplate;
    var mobileTemplate;
    
    $.ajax({
        url: "./templates/mobileNavmenu.html",
        method: "GET",
        async: false,
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
    })

    $.ajax({
        url: "./templates/headerMenu.html",
        method: "GET",
        async: false,
        success: function (data) {
            var html = '';
            menuTemplate = _.template(data);
            html += menuTemplate({menus: ["home", "services", "website design", "portfolio", "get a quote", "blog", "testimonials", "contact"]});
            $(document.body).append(html);
        }
    })

    
})();
