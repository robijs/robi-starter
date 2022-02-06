import { App } from '../Core/App.js'
import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ChartJs(param) {
    const {
        margin, padding, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='chart'>
                <div class='chart-title'></div>
                <div class='chart-container'>
                    <canvas class="chart-canvas" height='300'></canvas>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                border-radius: 10px;
                width: 100%;
            }

            /** Chart */
            #id .chart-container {
                position: relative;
                margin-top: 10px;
            }

            #id .chart-title {
                min-height: 27px;
                color: var(--color);
                font-size: 18px;
                font-weight: 500;
                text-align: center;
                transition: opacity 500ms ease;
                opacity: 0;
            }
        `,
        parent,
        position,
        events: [

        ]
    });

    // TODO: This should live in Chart component
    // Add chart
    component.setChart = (param) => {
        const { data, stepSize } = param;

        const chart = component.getChart();

        if (!chart) {
            return;
        }

        return new Chart(chart, {
            type: 'bar',
            data,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            // borderColor: App.get('primaryColor'),
                            borderColor: App.get('borderColor'),
                            // display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            beginAtZero: true
                        }
                    },
                    y: {
                        grid: {
                            // borderColor: App.get('primaryColor'),
                            borderColor: App.get('borderColor'),
                            // display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            min: 0,
                            stepSize
                        }
                    }
                }
            }
        });
    }

    component.setTitle = (text) => {
        const title = component.find('.chart-title');

        if (title) {
            title.innerText = text;
            title.style.opacity = '1';
        }
    };

    component.clearChart = () => {
        const chartContainer = component.find('.chart-container');

        chartContainer.innerHTML = /*html*/ `<canvas class="chart-canvas" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.chart-canvas')?.getContext('2d');
    };

    return component;
}
// @END-File
