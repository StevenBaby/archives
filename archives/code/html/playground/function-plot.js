/* jshint esversion: 6 */


function plot() {
    functionPlot({
        target: "#root",
        // title: 'function plot',
        width: $('#root').width(),
        labels: false,
        height: $('#root').width() / 1.77,
        yAxis: {
            domain: [-6 / 1.77, 6/ 1.77]
        },
        xAxis: {
            domain: [-6, 6]
        },
        // tip: {
        //     renderer: function () {}
        // },
        // grid: true,
        data: [{
                fn: "x^2",
                derivative: {
                    fn: "2 * x",
                    updateOnMouseMove: true
                }
            },
            {
                fn: "sin(x)",
                // derivative: {
                //   fn: "cos(x)",
                //   updateOnMouseMove: true
                // }
            }, {
                fn: "x - 1/6 * x^3",
            }
        ]
    });
}

$(document).ready(function () {
    plot();
});

$(window).resize(function () {
    plot();
});