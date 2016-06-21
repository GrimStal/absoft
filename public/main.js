/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
(function (){
    "use strict";
    
    var html = '';
    var menuTemplate;

    $.ajax({
        url: "./templates/headerMenu.html",
        method: "GET",
        async: false,
        success: function (data) {
            menuTemplate = _.template(data);
            html += menuTemplate({menus: ["home", "services", "website design", "portfolio", "get a quote", "blog", "testimonials", "contact"]});
            $(document.body).append(html);
        }
    })
})();
