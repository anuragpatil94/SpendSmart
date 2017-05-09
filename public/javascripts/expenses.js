$(function () {
    $("#submit").click(function (e) {
        e.preventDefault();
        $("#expense-form").submit();
        console.log("form submit");
    });
    $('.input-group.date').datepicker({
        todayBtn: "linked",
        autoclose: true,
        todayHighlight: true,
        format: "mm/dd/yyyy",
        startView: 0,
        minViewMode: 0
    });
    $('#confirm-delete').on('show.bs.modal', function (e) {
        $(this).find('#delete-form').attr('action', '/expenses/delete/' + $(e.relatedTarget).data('href'));
        $(this).find('.btn-ok').click(function (e) {
            e.preventDefault();
            $("#delete-form").submit();
            console.log("Delete");
        });

        $('.debug').html('Delete URL: <strong>' + $(this).find('.btn-ok').attr('href') + '</strong>');
    });
});