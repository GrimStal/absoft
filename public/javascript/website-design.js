/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

var aboutBox = $.Deferred();
var footer = $.Deferred();

var aboutObj = {
    titleTop: "WEBSITE DESIGN",
    titleBottom: "& DEVELOPMENT",
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
    text1: "Plenty of folks think that web design is all about slapping " +
            "some words and pictures together and posting them online. " +
            "No doubt that sort of attitude has created some of the atrocious " +
            "and non-working web sites we see out there. At MediaNovak, we " +
            "know that web design involves a lot of work – and we’re not scared " +
            "to roll up our sleeves and get our hands dirty. What this means is " +
            "that we take the time to understand our clients, their businesses " +
            "and their hopes and dreams for the future.",
    text2: "In 2014, more people will access the Internet via mobile devices " + 
            "than desktop PCs. For this reason, we make sure that when people " + 
            "visit your website, they will see a beautifully designed interface " + 
            "that is fully optimised for the device it’s served on – be that a " + 
            "widescreen desktop computer, laptop, tablet or mobile. We also " + 
            "consider your existing brand, logo, collateral, and primary audience. " + 
            "We take into account your budget, who your clients are, and what your business is " + 
            "all about. That’s because we don’t want to create a cookie-cutter web site. " + 
            "Please understand: we don’t have anything against cookies (in fact, we have " + 
            "bonded with chocolate chip cookies while working late to meet client deadlines " + 
            "many a time). However, we think that your business deserves a personalized " + 
            "web site that works for you – not for just anyone in your field.",
    textBig: "WE BUILD CUSTOM WEBSITES THAT ACTUALLY GROW YOUR BUSINESS, BRING IN MORE LEADS AND INCREASE YOUR BOTTOM LINE."
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