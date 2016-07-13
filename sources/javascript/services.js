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
            if ($(elem).val().length === 0) {
                $(elem).parent().append('<span role="alert" class="contact-not-valid-tip">Please fill the required field.</span>');
            }
            console.log($(elem).parent());
        });

        if ($(".contact-not-valid-tip").length === 0) {
            $(".contact-form-div img.ajax-loader").css("visibility", "visible");
            $.ajax({
                url: $('form').attr('action'),
                type: "POST",
                contentType: 'application/x-www-form-urlencoded',
                data: {name: $('#name').val(), email: $("#email").val(), message: $("#message").val()},
                success: function (data) {
                    console.log("!!!!!!!!!!!");
                    console.log(data);
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
