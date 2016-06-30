/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

var aboutBox = $.Deferred();
var footer = $.Deferred();

var aboutObj = {
    titleTop: "LOGO DESIGN",
    titleBottom: "& COLLATERAL",
    items:
            [
                {
                    img: "online-marketing-explained-1",
                },
                {
                    img: "critical-logo-design-tips-1"
                },
                {
                    img: "photography-portfolio-secrets-1"
                },
                {
                    img: "business-card-guidelines-2"
                }
            ],
    text1: "MediaNovak has taken what was once a long, expensive process and " + 
            "turned it into an easy, even fun experience. With a little input " + 
            "from you about your company, our professional logo designers will " + 
            "provide you with a great-looking, custom company logo design quickly " + 
            "and inexpensively. Design and branding of your logo along with company " + 
            "messaging is important for any size company. A logo design often " + 
            "requires many revisions and hours of research into other brands in " + 
            "your marketplace. Our design and marketing team can assist you in a " + 
            "variety of branding and messaging needs.",
    text2: "A good logo is the heart and soul of your business image. It has the " + 
            "ability to speak volumes with whispers, captivate prospective customers, " + 
            "and foster emotional loyalty. Your logo can communicate your company philosophy " + 
            "and generate brand pride in one fell swoop. At MediaNovak, we take the time to " + 
            "get to know you, your company, and your competitors, to make sure the image " + 
            "we create resonates with your customers and sets you in front of the pack. " +
            "We ask a lot of questions and listen to the answers to find a clear-cut " + 
            "direction. Once we have established the brand objectives and your target " + 
            "market, we get to work designing. We then get your feedback, and make any " + 
            "necessary adjustments before handing off the final files.",
    textBig: "YOUR LOGO IS THE FACE OF YOUR BRAND. IT SHOULD BE STRIKING, EASILY RECOGNIZED AND APPROPRIATE TO YOUR BUSINESS."
};

headerMenu.then(
        function () {
            _createTemplate("/templates/about.html", aboutObj, aboutBox);
        });
        
aboutBox.then(
        function(){
            $("#carousel-example-generic .carousel-inner > .item:first").addClass("active");
            _createTemplate("/templates/footer.html", {}, footer);
        });
