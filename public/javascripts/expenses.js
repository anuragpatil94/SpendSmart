$(function () {
    $("#submit").click(function (e) {
         e.preventDefault();
         $("#expense-form").submit();
         console.log("form submit");
    });
    $(".list-group-item").hover(function(){
        $(this).find(".glyphicon").removeClass("hidden");
    }, function(){
        $(this).find(".glyphicon").addClass("hidden");
    });
});