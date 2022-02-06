import { Get, SiteUsageModel } from '../Robi.js'

(async () => {
    onmessage = async event => {
        const { envMode, site, type, date } = event.data;

        let filter;

        switch (type) {
            case 'today':
                const today = new Date().toISOString().split('T')[0];

                // TODO: Translate this API to work with json-server
                // TODO: Test on SharePoint
                filter = `Created ge datetime'${today}T00:00:00Z' and Created lt datetime'${today}T23:59:59Z'`;
                break;
        }

        const items = await Get({
            list: 'Log',
            select: 'Id,Title,SessionId,Created,Message,Module,StackTrace,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            orderby: 'Id desc',
            path: site,
            mode: envMode
        });

        const visitors = [...new Set(items.map(item => item.Author.Title))];

        const pages = [...new Set(items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.location) {
                    return message.location.split('#')[1];
                }
            } catch (error) {
                // console.log(error);
            }
        }))].filter(item => item !== undefined);
    
        const allPages = items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.location) {
                    return message.location.split('#')[1];
                }
            } catch (error) {
                // console.log(error);
            }
        }).filter(item => item !== undefined);
    
        const roles = [...new Set(items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.role) {
                    return message.role;
                }
            } catch (error) {
                // console.log(error);
            }
        }))].filter(item => item !== undefined);
    
        const allRoles = items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.role) {
                    return message.role;
                }
            } catch (error) {
                // console.log(error);
            }
        }).filter(item => item !== undefined);
    
        const mostPopularPage = mode(allPages);
        const mostPopularRole = mode(allRoles);
    
        /** {@link https://stackoverflow.com/a/20762713} */
        function mode(arr){
            return arr.sort((a,b) =>
                    arr.filter(v => v===a).length
                - arr.filter(v => v===b).length
            ).pop();
        }
    
        /** Model Site Usage */
        const chartData = SiteUsageModel({
            type,
            date,
            items
        });

        postMessage({
            topBannerData: [
                {
                    label: 'Total Page Views',
                    value: items.length
                },
                {
                    label: 'Unique Page Views',
                    value: pages.length
                },
                {
                    label: 'Unique Users', // NOTE: Same as Active users, making it redundant
                    value: visitors.length
                },
                {
                    label: 'Unique Roles',
                    value: roles.length
                }
            ],
            bottomBannerData: [
                // FIXME: how to calculate?
                // {
                //     label: 'Average Visit Length',
                //     value: '00:00:00',
                //     description: 'HH:MM:SS'
                // },
                {
                    label: 'Most Popular Page',
                    value: mostPopularPage
                },
                {
                    label: 'Most Active Role',
                    value: mostPopularRole
                },
                {
                    label: 'Most Active User',
                    value: formatName(visitors[0]),
                    description: '' // TODO: Display user's role
                },
                {
                    label: 'Last used',
                    value: new Date(items[0].Created).toLocaleDateString() + ' ' + new Date(items[0].Created).toLocaleTimeString('default', { timeStyle: 'short', hour12: false }),
                    description: formatName(items[0].Author.Title)
                }
            ],
            chartData
        });
    }

    function formatName(name) {
        return name.split(' ').slice(0, 2).join(' ');
    }
})();
