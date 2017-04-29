$(function () {
    $("#submit").click(function (e) {
         e.preventDefault();
         $("#profile-form").submit();
         console.log("form submit");
    });
 
});