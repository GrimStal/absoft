/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

var aboutBox = $.Deferred();
var footer = $.Deferred();

var aboutObj = {
    titleTop: "BRANDING",
    titleBottom: "& STATIONARY",
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
    text1: "A brand isn’t just a pretty logo, engaging website or strategic marketing plan. It is a deliberate, cohesive message. A story. An idea and connection transformed into an experience. Your brand is an ecosystem powered by all the things you represent – from your core values to the way you interact with your clients to the form and function that exists within your design. Here at MediaNovak we understand how to apply the colors and fonts of your logo to your business cards, letterheads and compliments slips in order to create an image your clients will remember.",
    text2: "Nothing makes a business look more credible than professionally designed stationery. Nearly everyone has been handed a cheap business card or received business correspondence on a generic letterhead. It leaves you wondering if the business is reliable or if they’re a fly-by-night. By contrast, professionally designed stationery helps to form a lasting impression in the minds of your potential clients and business partners. They’ll not only remember you, but they’ll know that you’re a serious business that they can trust. An investment in professionally designed stationery will pay off every time you hand out your business card and every time you send a letter.",
    textBig: "OUR GOAL IS TO BUILD SOMETHING THAT IS HIGHLY-TARGETED TO YOUR INTENDED AUDIENCES, INTUITIVE, USEFUL, MAYBE EVEN FUN."
};

headerMenu.then(
        function () {
            _createTemplate("/templates/about.html", aboutObj, aboutBox);
        });

aboutBox.then(
        function () {
            $("#carousel-example-generic .carousel-inner > .item:first").addClass("active");
            _createTemplate("/templates/footer.html", {}, footer);
        });
