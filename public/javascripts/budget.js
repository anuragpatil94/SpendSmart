$(function () {
    $("#submit").click(function (e) {
        e.preventDefault();
        $("#budget-form").submit();
    });
    $('.input-group.date').datepicker({
        autoclose: true,
        format: "mm/yyyy",
        startView: 1,
        minViewMode: 1
    });
});