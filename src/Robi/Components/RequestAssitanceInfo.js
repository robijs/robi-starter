import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function RequestAssitanceInfo(param) {
    const {
        data, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class="request-assitance-info w-100">
                ${buildInfo()}
                <div class="alert alert-robi-primary" role="alert">
                    <p class="mb-3">For general CarePoint issues, please contact:</p>
                    <div>
                        <h6 class="mb-2">DHA Global Service Center (GSC)</h6>
                        <p class="mb-1">
                            <a href="tel:18006009332" class="alert-link">1 (800) 600-9332</a>
                        </p>
                        <p class="mb-2">Use the keyword <strong><i>MHS Information Platform</i></strong> or <strong><i>MIP</strong></i></p>
                        <p class="mb-1">
                            <a href="mailto:dhagsc@mail.mil" class="alert-link">dhagsc@mail.mil</a>
                        </p>
                        <p class="mb-0">
                            <a href="https://gsc.health.mil/" class="alert-link">https://gsc.health.mil</a>
                        </p>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id p {
                font-size: 14px;
            }

            #id .alert {
                border-radius: 20px;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildInfo() {
        return data.map(item => {
            const {
                label, name, title, email, phone,
            } = item;

            return /*html*/ `
                <div class="alert alert-robi-secondary" role="alert">
                    <p class="mb-3">${label}</p>
                    <div>
                        <h5 class="mb-1">${name}</h5>
                        <p class="mb-2">${title}</p>
                        <p class="mb-1">
                            <a href="mailto:${email}" class="alert-link">${email}</a>
                        </p>
                        <p class="mb-0">
                            <a href="tel:${phone.replace(/([()-.\s])+/g, '')}" class="alert-link">${phone}</a>
                        </p>
                    </div>
                </div>
            `;
        }).join('\n');
    }

    return component;
}
// @END-File
