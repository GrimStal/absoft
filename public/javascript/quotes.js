/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */
"use strict";

$(document).scroll(function (e) {
    var top = $(document).scrollTop();
    if (top > 0) {
        $("header").addClass('sticky');
    } else {
        $("header").removeClass('sticky');
    }
});

$("#carousel-example-generic .carousel-inner > .item:first").addClass("active");

$('form').submit(function () {
    return false;
});

$("#submit").on({
    'click': function () {
        $(".contact-not-valid-tip").remove();
        $("[aria-required='true']").each(function (num, elem) {
            var regexp;
            if ($(elem).attr("data-regexp")){
                regexp = new RegExp($(elem).attr("data-regexp"));
            }
            
            if ($(elem).val().length === 0) {
                $(elem).parent().append('<span role="alert" class="contact-not-valid-tip">Please fill the required field.</span>');
            } else if (regexp && !regexp.exec($(elem).val())){
                console.log(!regexp.exec($(elem).val()));
                console.log(regexp);
                $(elem).parent().append('<span role="alert" class="contact-not-valid-tip">Data entered with mistakes.</span>');
            }
        });
        
//        $("[name='services[]']").each(
//                function(num, elem){
//                    var a = $(elem).parent();
//                    if ($(a).find("svg").html().length){
//                        $(elem).attr("checked", true);
//                    } else {
//                        $(elem).attr("checked", false);
//                    }
//                });

        if ($(".contact-not-valid-tip").length === 0) {
            $(".contact-form-div img.ajax-loader").css("visibility", "visible");
            var dataObj = {
                fullName: $('#name').val(),
                email: $("#email").val(),
                website: $("#website").val(),
                company: $("#company-name").val(),
                phone: $("#phone").val(),
                country: $("#country").val(),
                webDesign: $("#webDesign").prop("checked"),
                blogDesign: $("#blogDesign").prop("checked"),
                domainName: $("#domainName").prop("checked"),
                webHosting: $("#webHosting").prop("checked"),
                logoDesign: $("#logoDesign").prop("checked"),
                stationaryDesign: $("#stationaryDesign").prop("checked"),
                completeBranding: $("#completeBranding").prop("checked"),
                businessCardDesign: $("#businessCardDesign").prop("checked"),
                eCommerceStore: $("#eCommerceStore").prop("checked"),
                describe: $("#project-description").val(),
                budget: $("#budget").val(),
                know: $("[name='contact-method'] option:selected").val()
            };
            
            $.ajax({
                url: "/get-a-quote/leavequote",
                type: "POST",
                contentType: 'application/x-www-form-urlencoded',
                data: dataObj,
                success: function (data) {
                    if (data.succ) {
                        $(".contact-response-output").removeClass("contact-mail-error");
                        $(".contact-response-output").addClass("contact-mail-sent-ok");
                        $(".contact-response-output").text(data.result);
                    } else {
                        $(".contact-response-output").removeClass("contact-mail-sent-ok");
                        $(".contact-response-output").addClass("contact-mail-error");
                        $(".contact-response-output").text(data.result);
                    }
                    $(".contact-response-output").attr("role", "alert");
                    $(".contact-form-div img.ajax-loader").css("visibility", "hidden");
                },
                error: function (error) {
                    console.log("!!!!!!!!!!!");
                    console.log(error);
                    error = error || "Some troubles with leaving your message. Try again later";
                    $(".contact-response-output").removeClass("contact-mail-sent-ok");
                    $(".contact-response-output").addClass("contact-mail-error");
                    $(".contact-response-output").text(error);
                    $(".contact-form-div img.ajax-loader").css("visibility", "hidden");
                }
            });
        } else {
            $(".contact-response-output").removeClass("contact-mail-sent-ok");
            $(".contact-response-output").addClass("contact-mail-error");
            $(".contact-response-output").text("Please, fill all required fields");
        }
    }
});