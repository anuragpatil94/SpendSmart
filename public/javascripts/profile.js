$(function () {
    $("#profile-form").validator();
    $("#submit").click(function(e){
        e.preventDefault();
        $("#profile-form").submit();
    });
});