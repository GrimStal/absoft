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

$('input[type=file]').bootstrapFileInput();

$("#add-examples").on({
    'click': function(){
        var number = ($("#examples-form-group .examples-form-groups").last().attr("id") ? parseInt($("#examples-form-group .examples-form-groups").last().attr("id").slice('examples-form-group-'.length)) + 1 : 1);
        var block = "<div class='form-group examples-form-groups' id='examples-form-group-" + number + "'>";
        block += "<label for='examples-field-" + number + "'>Image " + number + ":</label>";
        block += "<input type='file' id='examples-field-" + number + "' title='Select file to add' name='examplesnew' accept='image/*,image/jpeg,image/png'>";
        block += "<button class='btn btn-danger' id='examples-delete-" + number + "' onclick=\"";
        block += "$(\'#examples-" + number + "\').prop(\'name\', \'\');";
        block += "$(\'#examples-field-" + number + "\').prop(\'name\', \'\');";
        block += "$($(\'#examples-field-" + number + "\').parent()).addClass(\'disabled\');";
        block += " $(\'#examples-delete-" + number + "\').prop(\'disabled\', \'true\');"; 
        block += "\">Delete</button>";
        block += "<input type='hidden' id='examples-" + number + "' name='examples' class='form-control' value=''>";
        block += "</div>";
        $("#examples-form-group").append(block);
        $($("#add-examples")).insertAfter($("#examples-form-group-" + number));
        $("#examples-field-" + number).bootstrapFileInput();
    }
});

$("#add-socials").on({
    'click': function(){
        var number = ($("#socials-form-group .socials-form-groups").last().attr("id") ? parseInt($("#socials-form-group .socials-form-groups").last().attr("id").slice('socials-form-group-'.length)) + 1 : 1);
        var block = "<div class='form-group socials-form-groups' id='socials-form-group-" + number + "'>";
        block += "<label for='socials-field-" + number + "'>Social " + number + ":</label>";
        block += "<input type='url' id='socials-field-" + number + "' class='form-control' name='socials' required>";
        block += "<button class='btn btn-danger' id='socials-delete-" + number + "' onclick=\"";
        block += "$(\'#socials-field-" + number + "\').prop(\'name\', \'\');";
        block += "$(\'#socials-field-" + number + "\').prop(\'disabled\', \'true\');";
        block += "$(\'#socials-field-" + number + "\').prop(\'required\', \'false\');";
        block += " $(\'#socials-delete-" + number + "\').prop(\'disabled\', \'true\');"; 
        block += "\">Delete</button>";
        block += "</div>";
        $("#socials-form-group").append(block);
        $($("#add-socials")).insertAfter($("#socials-form-group-" + number));
    }
});

checkReady();


