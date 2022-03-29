// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { App } from '../../Robi/Robi.js'

// @START-Chart
export default async function ChartDemo(param) {
    const {
        parent,
    } = param;

    parent.append(/*html*/ `
        <div class='position-relative h-75 w-100 mt-4'>
            <canvas class="myChart"></canvas>
        </div>
    `);

    const ctx = document.querySelector('.myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 3
            }]
        },
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
                        borderWidth: 3,
                        borderColor: App.get('primaryColor'),
                        display: false
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
                        borderWidth: 3,
                        borderColor: App.get('primaryColor'),
                        display: false
                    },
                    stacked: true,
                    ticks: {
                        font: {
                            weight: 700,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                        },
                        color: App.get('defaultColor'),
                        min: 0,
                        stepSize: 1
                    }
                }
            }
        }
    });
}
// @END-Chart
