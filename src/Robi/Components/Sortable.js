import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Sortable({ parent, position }) {
    const component = Component({
        html: /*html*/ `
            <div>
                <!-- <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 1</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 2</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 3</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 4</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 5</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 6</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 7</div> -->
                
                <!-- <div class="nav ui-state-disabled">
                    Item 1
                </div>
                <div class="nav">
                    Item 2
                </div>
                <div class="nav">
                    Item 3
                </div>
                <div class="nav">
                    Item 4
                </div>
                <div class="nav">
                    Item 5
                </div>
                <div class="nav">
                    Item 6
                </div>
                <div class="nav">
                    Item 7
                </div> -->
            </div>
        `,
        style: /*css*/ `
            #id .nav {
                display: flex;
                background: ${App.get('primaryColor')};
                border-radius: 10px;
                margin: 10px 0px;
                padding: 10px;
                color: white;
            }

            #id .ui-sortable-handle {
                cursor: grab;
            }

            #id .ui-sortable-helper {
                cursor: grabbing;
            }
        `,
        position,
        parent,
        events: [],
        onAdd() {
            $(`#${component.get().id}`).sortable({
                items: 'div:not(.ui-state-disabled)'
            });

            $(`#${component.get().id}`).disableSelection();
        }
    });

    return component;
}
// @END-File
