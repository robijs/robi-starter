import { CreateItem, Get } from '../../Robi/Robi.js'
import { LookupField } from '../../Robi/RobiUI.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function NewForm(param) {
    const { event, fields, list, modal, parent, table } = param;

    // Lookup Field
    const lookupField = LookupField({
        label: 'DMIS Lookup',
        description: "Search any market, facility name, or DMIS ID",
        parent,
        onSelect({ event, item }) {
            console.log(event, item);
        }
    });

    lookupField.add();

    // ---

    parent.insertAdjacentHTML('beforeend', /*html*/ `
        <div class='' style='margin-bottom: 20px;'>
            <label style='font-weight: 500;'>Logs</label>
            <input id="search-logs" class="form-control ui-autocomplete-input" type="text" placeholder="Search by title" autocomplete="off">
        </div>
    `);

    // Modified from: https://info.health.mil/staff/analytics/COVID19VaccineVisualization/SitePages/CVVDHome.aspx Lines: 804 - 866
    // Author: Junayd Park
    $("#search-logs")
    .autocomplete({
        source(request, response) {
			const filter = [
                `(substringof('${request.term}', Title) eq true`,
            ].join(' or ');

            Get({
                list: "Log",
                filter
            })
            .then(data => {
                response(data);
            })

			// $.ajax({
			// 	url: `https://carepoint.health.mil/sites/J5/_api/web/lists/GetByTitle('DMISDemo')/items?$top=400&$filter=${filter}&$select=Title,dmis_facility_name_label,dmis_facility_name,parent_dmis_label,fema_region,facility_state_code,facility_state_description,facility_city_name,market_name`,
			// 	method: "GET",
			// 	headers: {
			// 		"Accept": "application/json; odata=verbose",
            //         'Content-Type': 'application/json; charset=UTF-8'
			// 	},
			// 	success: function (data) {
            //         dmisItems = data.d.results;
            //         response(data.d.results);
			// 	},
			// 	error: function (data) {
			// 		console.log("Sorry, error occurred in the getMasterVaccineRecord function. The error is: " + data.statusText);
			// 	}
			// });
        },
        minLength: 2,
        focus(event, ui) {
			$("#search-logs").val(ui.Title);
			return false;
        },
        select(event, ui) {
			$("#search-logs").val(ui.Title);
			return false;
        }
    })
    .autocomplete("instance")
    ._renderItem = ( ul, item ) => {
        return $("<li>")
        .append(/*html*/ `
            <div>
                ${item.Title}
            </div>
        `)
        .appendTo( ul );
    };

    $('.ui-menu').css({ "transform": "translateY(4px)" });

    // ---

    return {
        async onCreate(event) {
            return {};
        }
    };
}
// @END-File