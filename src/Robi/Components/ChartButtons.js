import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ChartButtons(param) {
    const {
        margin, padding, data, parent, position, onClick
    } = param;

    const {
        visits,
    } = data;

    const component = Component({
        html: /*html*/ `
            <div class='chart-container'>
                <!-- Chart -->
                <div class='chart' style='flex: 4;'>
                    <div class='chart-title'></div>
                    <div class='chart-canvas'>
                        <canvas class="myChart" height='300'></canvas>
                    </div>
                </div>
                <!-- Text -->
                <div class='chart' style='flex: 1'>
                    <div class='visits-label'>Visits</div>
                    ${createInfoGroup('Today', 'today')}
                    ${createInfoGroup('This Week', 'week')}
                    ${createInfoGroup('This Month', 'month')}
                    ${createInfoGroup('This Year', 'year')}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                background: var(--secondary);
                border-radius: 4px;
                display: flex;
                overflow: auto;
            }

            /** Left/Right Containers */
            #id .chart {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
            }

            /** Text */
            #id .visits-label {
                text-align: center;
                font-weight: 700;
                font-size: 18px;
                margin-bottom: 12px;
            }

            #id .info-group {
                cursor: pointer;
                margin: 5px 0px;
            }

            #id .chart-container-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }

            #id .chart-container-info.smaller {
                font-size: .8em;
            }

            #id .chart-container-info-label {
                font-weight: 500;
                margin-right: 30px;
            }

            /** Chart */
            #id .chart-canvas {
                position: relative;
                margin-right: 15px;
                margin-bottom: 15px;
            }

            #id .chart-title {
                margin-top: 15px;
                color: var(--color);
                font-size: 1.1em;
                font-weight: 700;
                text-align: center;
            }

            /** Label */
            #id .info-group {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            #id .info-group button {
                flex: 1;
                white-space: nowrap;
            }

            #id .info-count {
                border-radius: 8px;
                padding: 5px;
                border: none;
                width: 70px;
                text-align: center;
                font-weight: 700;
            }

            /* Testing Placeholder shimmer */
            .shimmer {
               background: #f6f7f8;
               background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
               background-repeat: no-repeat;
               background-size: 800px 104px; 
               display: inline-block;
               position: relative; 
               
               -webkit-animation-duration: 1s;
               -webkit-animation-fill-mode: forwards; 
               -webkit-animation-iteration-count: infinite;
               -webkit-animation-name: placeholderShimmer;
               -webkit-animation-timing-function: linear;
            }
             
             @-webkit-keyframes placeholderShimmer {
                0% {
                    background-position: -468px 0;
                }
               
                100% {
                    background-position: 468px 0; 
                }
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .info-group',
                event: 'click',
                listener(event) {
                    const label = this.dataset.label;

                    if (label) {
                        onClick(label);
                    }
                }
            }
        ]
    });

    function createInfoGroup(label, property) {
        return /*html*/ `
            <div class="info-group" data-label='${property}'>
                <div class="info-count">${visits[property].length}</div>
                <button type='button' class='btn btn-robi'>${label}</button>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.chart-title');

        title.innerText = text;
    };

    component.clearChart = () => {
        const chartContainer = component.find('.chart-canvas');

        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    };

    return component;
}
// @END-File
