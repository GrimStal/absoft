/* 
 * AB-Soft test project
 * @author Borshchov Dimitriy <grimstal@bigmir.net> 
 */

"use strict";

function getChanges() {
    $.ajax({
        url: "/adminpage/checkupdates",
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function (obj) {
            viewChanges(obj);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

getChanges();
setInterval(getChanges, 5000);


function checkReady() {
    console.log($(".error").length);
    if (!$(".error").length) {
        $("#submit-button").attr("disabled", false);
    } else {
        $("#submit-button").attr("disabled", true);
    }
}

$("[data-check]").each(function (num, elem) {
    var key = $(elem).attr("data-check");

    $("#" + key + "-field").change(function () {
        $("#" + key + "-form-group").removeClass("has-success");
        $("#" + key + "-form-group").addClass("has-error");
        $("#" + key + "-form-group").addClass("error");
        checkReady();
    });

    $(elem).on({
        "click": function () {
            $.ajax({
                url: "/adminpage/uniqueexists",
                dataType: "json",
                data: {tablename: $("#tablename").val(), key: key, data: $("#" + key + "-field").val(), id: $("#_id-field").val()},
                method: "post",
                success: function (data) {
                    console.log(data);
                    if (data.result === "OK") {
                        $("#" + key + "-form-group").removeClass("has-error");
                        $("#" + key + "-form-group").removeClass("error");
                        $("#" + key + "-form-group").addClass("has-success");
                    } else {
                        $("#" + key + "-form-group").removeClass("has-success");
                        $("#" + key + "-form-group").addClass("has-error");
                        $("#" + key + "-form-group").addClass("error");
                    }
                    checkReady();
                },
                error: function (error) {
                    console.log(error);
                    $("#" + key + "-form-group").removeClass("has-success");
                    $("#" + key + "-form-group").addClass("has-error");
                    $("#" + key + "-form-group").addClass("error");
                    checkReady();
                }

            });
        }
    });
});

checkReady();


