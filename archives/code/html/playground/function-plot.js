/* jshint esversion: 6 */


function plot() {
    functionPlot({
        target: "#root",
        width: $('#root').width(),
        height: $('#root').width() / 1.77,
        yAxis: {
            domain: [-1, 9]
        },
        tip: {
            renderer: function () {}
        },
        grid: true,
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