$(function () {
    $("#budget-form").validator();
    $('.input-group.date').datepicker({
        autoclose: true,
        format: "mm/yyyy",
        startView: 1,
        minViewMode: 1
    });

    google.charts.load('current', {
        packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var jVal = JSON.parse($("#budget").val());
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Category');
        data.addColumn('number', 'Amount');
        for (var i = 0; i < jVal.length; i++) {
            data.addRow([jVal[i].category, jVal[i].amount]);
        }

        // Set chart options
        var options = {
            'titlePosition': 'none',
            'is3D': 'true',
            'height': '400',
            'legend': {
                'position': 'top',
                'maxLines': '3'
            }
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
});