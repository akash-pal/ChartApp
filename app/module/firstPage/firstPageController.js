
app.controller('firstPageController', firstPageController);

function firstPageController($scope, networkService) {

    /*Heading of chart*/
    $scope.heading = "Overall Performance";

    /*For Storing the chart response*/
    let chartValues;

    /*Chart x-axis labels*/
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /*Chart multiline, each object representaing a line*/
    let chartObject = [{
        label: "Mail Requests",
        key: "mailRequests",
        fillColor: "#01ffea",
        borderColor: "#01ffba",
        backgroundColor: "#01ffba",
    },
    {
        label: "Mail Delivered",
        key: "mailDelivered",
        fillColor: " #1878f0",
        borderColor: "#0058cb",
        backgroundColor: "#0058cb",
    },
    {
        label: "Mail Bounced",
        key: "mailBounced",
        fillColor: "#00caff",
        borderColor: "#2bbcf5",
        backgroundColor: "#2bbcf5",
    },
    {
        label: "Mail Opened",
        key: "mailOpened",
        fillColor: "#fcdf3f",
        borderColor: "#ff6c00",
        backgroundColor: "#ff6c00",
    }];

    /*Get chat data from service */
    function getData() {

        networkService.getData().then(function (response) {
            chartValues = response.data;
            console.log(chartValues);
            showChart();
        });

    }

    /*Get Data from the chart response
      Takes two parameters 
      chartType - chartType can be : mailRequests/mailDelivered/mailBounced/mailOpened
      key - the value to extract from each object can be : key
    */
    function getValue(chartType, key) {

        let value = chartValues[chartType].map(function (item) {
            return item[key];
        });

        return value;
    }

    /* Displays the chart */
    function showChart() {

        /*Chart y-axis gap value*/
        let ticks = [2000, 1500, 1000, 500, 0];

        /*Chart Data set array*/
        let dataSetArray = [];

        /*Chart legend container*/
        let myLegendContainer = document.getElementById("chartjsLegend");

        /*Default line chart assigned to ShowLine*/
        Chart.defaults.ShadowLine = Chart.defaults.line;

        /* ShadowLineElement extended from Line Chart*/
        const ShadowLineElement = Chart.elements.Line.extend({

            draw() {

                const { ctx } = this._chart

                const originalStroke = ctx.stroke

                ctx.stroke = function () {
                    ctx.save()
                    ctx.shadowColor = '#998';
                    ctx.shadowBlur = 15;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 20;
                    originalStroke.apply(this, arguments)
                    ctx.restore()
                }

                Chart.elements.Line.prototype.draw.apply(this, arguments)

                ctx.stroke = originalStroke;
            }

        })

        /*ShadowLine Chart datasetElementType set to ShadowLineElement*/
        Chart.controllers.ShadowLine = Chart.controllers.line.extend({
            datasetElementType: ShadowLineElement
        })

        /* Chart data set array populated using each chartObject*/
        chartObject.forEach(function (item) {

            let dataSetObj = {
                label: item.label,
                fillColor: item.fillColor,
                borderColor: item.borderColor,
                backgroundColor: item.backgroundColor,
                radius: 0,
                fill: false,
                data: getValue(item.key, 'count')
            }

            dataSetArray.push(dataSetObj);
        });

        /*Data for chart */
        let data = {
            labels: months,
            datasets: dataSetArray
        }

        /*ShadowLine Chart drawn on canvas*/
        let myChart = new Chart(document.getElementById('canvas'), {
            type: 'ShadowLine',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'nearest',/*for showing toolip on hovering nearby*/
                    intersect: false
                },
                legend: {
                    display: false /*hide default legend*/
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            drawOnChartArea: false,
                            display: false /*x-axis hide guidlines*/
                        },
                        ticks: {
                            padding: 20,
                            autoSkip: false /*x-axis value show all*/
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            drawBorder: false,
                            tickMarkLength: 30,
                        },
                        ticks: {
                            padding: 10,
                            autoSkip: false, /*y-axis value show all*/
                            min: ticks[ticks.length - 1],/*min limit y-axis value*/
                            max: ticks[0],/*max limit y-axis value*/
                            userCallback: function (value, index, values) {
                                /*comma seperated for hundreds value*/
                                value = value.toString();
                                value = value.split(/(?=(?:...)*$)/);
                                value = value.join(',');
                                return value;
                            }
                        },
                        afterBuildTicks: function (scale) {
                            scale.ticks = ticks;
                            return;
                        },
                        beforeUpdate: function (oScale) {
                            return;
                        }
                    },
                    ]
                }
            }
        })

        /*HTML legend generated*/
        myLegendContainer.innerHTML = myChart.generateLegend();

        /*For each legend item a click event listener is assigned*/
        let legendItems = myLegendContainer.getElementsByTagName('li');

        for (let i = 0; i < legendItems.length; i++) {
            let item = legendItems[i];
            item.addEventListener("click", function () {
                legendClickCallback(event, i);
            }, false);
        }

        function legendClickCallback(event, index) {

            event = event || window.event;

            let target = event.target || event.srcElement;

            while (target.nodeName !== 'LI') {
                target = target.parentElement;
            }

            myChart.legend.options.onClick.call(myChart, event, myChart.legend.legendItems[index]);

            /*check if line is visible and toggle based on that*/
            if (myChart.isDatasetVisible(index)) {
                /*show line and un-strike label*/
                target.classList.remove('hidden');
            } else {
                /*hide line and strike label*/
                target.classList.add('hidden');
            }

        }

    }

    /*Initial*/
    getData();

}
