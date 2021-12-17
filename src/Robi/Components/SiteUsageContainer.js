import { Card } from './Card.js' 
import { DashboardBanner } from './DashboardBanner.js' 
import { LoadingSpinner } from './LoadingSpinner.js' 
import { SiteUsage } from './SiteUsage.js' 
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { StartAndEndOfWeek } from '../Models/StartAndEndOfWeek.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function SiteUsageContainer(param) {
    const {
        parent
    } = param;

    /** Dashboard */
    const dashboardCard = Card({
        title: 'Site Usage',
        width: '100%',
        minHeight: '600px',
        margin: '20px 0px 0px 0px',
        parent
    });

    dashboardCard.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading site usage data',
        type: 'robi',
        classes: ['flex-grow-1'],
        parent: dashboardCard
    });

    loadingIndicator.add();

    const workerPath = App.get('mode') === 'prod' ? '../' : `http://127.0.0.1:8080/src/`;

    /** Worker */
    const worker = new Worker(`${workerPath}Robi/Workers/SiteUsage.js`, {
        type: 'module'
    });

    worker.postMessage({
        envMode: App.get('mode'),
        site: App.get('site'),
        bannerColor: App.get('backgroundColor')
    });

    Store.addWorker(worker);

    worker.onmessage = event => {
        const {
            data
        } = event;

        // console.log(data);
        /** Stats 1 */
        const stats_1 = DashboardBanner({
            data: data.stats_1,
            padding: '0px',
            border: 'none',
            margin: '10px 0px 0px 0px',
            parent: dashboardCard
        });

        stats_1.add();

        /** Bar Chart */
        const longCard = SiteUsage({
            data: data.model,
            parent: dashboardCard,
            border: 'none',
            margin: '10px 0px',
            padding: '0px',
            onClick(label) {
                console.log('label:', label);
                console.log('current selected chart:', selectedChart);

                if (label !== selectedChart) {
                    selectedChart = label;
                    selectedData = data.model.chart[label];

                    console.log('new selected chart:', selectedChart);
                    console.log('new selected data:', selectedData);

                    longCard.clearChart();

                    const chart = addChart({
                        card: longCard,
                        type: selectedChart,
                        data: selectedData
                    });
                } else {
                    console.log('*** already selected ***');
                }
            }
        });

        longCard.add();

        /** Start with type: 'week' on load */
        let selectedChart = 'today';
        let selectedData = data.model.chart[selectedChart];

        addChart({
            card: longCard,
            type: selectedChart,
            data: selectedData
        });

        /** Stats 2 */
        const stats_2 = DashboardBanner({
            data: data.stats_2,
            padding: '0px',
            border: 'none',
            margin: '0px',
            parent: dashboardCard
        });

        stats_2.add();

        /** Remove Loading Indicator */
        loadingIndicator.remove();
    };

    /** Add Chart */
    function addChart(param) {
        const {
            card, type, data
        } = param;

        const chart = card.getChart();
        const max0 = Math.max(...data[0].data.map(set => set.length)); /** Largest number from Breaches */
        const max1 = 0;
        // const max1 = Math.max(...data[1].data.map(set => set.length)); /** Largest number from Complaints */
        const max = (Math.ceil((max0 + max1) / 10) || 1) * 10; /** Round sum of max numbers to the nearest multiple of 10 */



        // const max = (Math.round((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10*/
        // const max = (Math.ceil((Math.max(...data.map(item => Math.max(...item.data)))) / 10) || 1 ) * 10;
        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch (type) {
            case 'today':
                labels = [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00'
                ];
                text = new Date().toLocaleDateString('default', {
                    dateStyle: 'full'
                });
                break;
            case 'week':
                const options = {
                    month: 'long',
                    day: 'numeric'
                };
                const startAndEndOfWeek = StartAndEndOfWeek();
                const sunday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                const saturday = startAndEndOfWeek.saturday.toLocaleString('default', options);

                // labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                text = `${sunday} - ${saturday}, ${startAndEndOfWeek.sunday.getFullYear()}`;
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                text = new Date().getFullYear();
                break;
            default:
                console.log('missing type');
                break;
        }

        card.setTitle(text);

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    /** [0] set is purple, [1] set is blue */
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 0.2)` : 'rgb(67, 203, 255, 0.2)',
                        borderColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 1)` : 'rgb(67, 203, 255, 1)',
                        // backgroundColor: index === 0 ? 'rgb(147, 112, 219, 0.2)' : 'rgb(67, 203, 255, 0.2)',
                        // borderColor: index === 0 ? 'rgb(147, 112, 219, 1)' : 'rgb(67, 203, 255, 1)',
                        borderWidth: 1
                    };
                })
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            /** Set to max value in dataset */
                            // max,
                            min: 0,
                            stepSize
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}
// @END-File
