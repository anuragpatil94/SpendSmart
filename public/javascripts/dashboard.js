$(function () {

    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dash = JSON.parse($("#data").val());
        // Create the data table.
        
        if (dash.hasCurrent) {
            var budget = new google.visualization.arrayToDataTable(dash.budget);

            var budgetOptions = {
                title: 'Budget vs Spent by Category',
                chartArea: {
                    width: '50%'
                },
                hAxis: {
                    title: 'Amount',
                    minValue: 0,
                },
                vAxis: {
                    title: 'Category'
                },
                height: 350
            };

            var budgetChart = new google.visualization.BarChart(document.getElementById('budget_div'));
            budgetChart.draw(budget, budgetOptions);
        }


        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Amount');
        for (var x = 0; x < dash.billsByDate.length; x++) {
            var date = new Date(dash.billsByDate[x].date);
            data.addRow([date.toDateString(), dash.billsByDate[x].amount]);
        }

        // Set chart options
        var options = {
            title: 'Daily Expenditure',
            legend: {
                position: 'none'
            },
            hAxis: {
                title: 'Date'
            },
            vAxis: {
                title: 'Amount'
            },
            height: 300
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('daily_div'));
        chart.draw(data, options);

        var monthData = new google.visualization.DataTable();
        monthData.addColumn('string', 'Month');
        monthData.addColumn('number', 'Amount');
        for (var i = 0; i < dash.billsByMonth.length; i++) {
            var month = new Date(dash.billsByMonth[i].date);
            var caption = month.toLocaleString("en-US", {
                month: "long"
            }) + " " + month.getFullYear();
            monthData.addRow([caption, dash.billsByMonth[i].amount]);
        }

        // Set chart options
        var monthoptions = {
            title: 'Monthly Expenditure',
            legend: {
                position: 'none'
            },
            hAxis: {
                title: 'Month'
            },
            vAxis: {
                title: 'Amount'
            },
            height: 300
        };
        var monthChart = new google.visualization.ColumnChart(document.getElementById('monthly_div'));
        monthChart.draw(monthData, monthoptions);
    }
});