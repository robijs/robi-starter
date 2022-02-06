import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Modal(param) {
    const { 
        title,
        classes,
        titleStyle,
        headerStyle,
        footerStyle,
        closeStyle,
        close,
        addContent,
        buttons,
        centered,
        fade,
        background,
        fullSize,
        showFooter,
        scrollable,
        contentPadding,
        parent,
        disableBackdropClose,
        position,
        shadow 
    } = param;
    
    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <!-- <div class='modal${fade ? ' fade' : ''}' tabindex='-1' role='dialog' aria-hidden='true'> -->
            <div class='modal fade ${ classes?.length ? classes.join(' ') : ''}' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content'>
                        ${
                            !title ?
                            /*html*/ `
                                <button type='button' class='close ${close ? '' : 'd-none'}' style='position: absolute; right: 0px; ${closeStyle || ''}' data-dismiss='modal' aria-label='Close'>
                                    <!-- <span class='icon-container' style='right: 20px; top: 20px;'> -->
                                    <span class='icon-container'>
                                        <svg class='icon x-circle-fill'>
                                            <use href='#icon-bs-x-circle-fill'></use>
                                        </svg>
                                        <svg class='icon circle-fill' style='z-index: 1;'>
                                            <use href='#icon-bs-circle-fill'></use>
                                        </svg>
                                    <span>
                                </button>
                            ` :
                            /*html*/ `
                                <div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${
                                        close !== false ?
                                        /*html*/ `
                                            <button type='button' class='close' ${closeStyle ? `style='${closeStyle}'` : ''} data-dismiss='modal' aria-label='Close'>
                                                <span class='icon-container'>
                                                    <svg class='icon x-circle-fill'>
                                                        <use href='#icon-bs-x-circle-fill'></use>
                                                    </svg>
                                                    <svg class='icon circle-fill'>
                                                        <use href='#icon-bs-circle-fill'></use>
                                                    </svg>
                                                <span>
                                            </button>
                                        ` : ''
                                    }
                                </div>
                            `
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
                            ${addFooterButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /** Title */
            #id .modal-title {
                color: var(--primary);
            }

            #id.modal {
                overflow-y: overlay; 
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 20px;
                border: none;
                background: ${background || 'var(--secondary)'};
                padding: ${contentPadding || '0px'};
            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
                /* cursor: move; */
            }
            
            /** Footer */
            #id .modal-footer {
                border-top: none;
            }

            /** Button radius */
            #id .btn {
                border-radius: 10px;
            }

            #id .btn * {
                color: inherit;
            }

            /** Button color */
            #id .btn-success {
                background: seagreen;
                border: solid 1px seagreen;
            }

            #id .btn-robi-primary {
                background: royalblue;
                border: solid 1px royalblue;
            }

            #id .btn-danger {
                background: firebrick;
                border: solid 1px firebrick;
            }

            #id .btn-secondary {
                background: none;
                border: solid 1px transparent;
                color: var(--color);
                font-weight: 500;
            }

            /** Button focus */
            #id .btn:focus {
                box-shadow: none;
            }

            /** Close focus */
            #id .close:focus {
                outline: none;
            }

            /** Close */
            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                width: 20px;
                height: 20px;
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .x-circle-fill {
                width: 24px;
                height: 24px;
                fill: var(--button-background);
                z-index: 10;
            }

            /** Footer */
            #id .modal-footer.hidden {
                display: none;
            }

            /** Zoom in */
            #id.fade {
                transition: opacity 75ms linear;
            }

            #id.modal.fade .modal-dialog {
                transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
            }

            #id.modal.fade .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(.5);
                transform: translate(0,0)scale(.5);
            }
            #id.modal.show .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(1);
                transform: translate(0,0)scale(1);
            }

            /** Override bootstrap defaults */
            ${fullSize ?
            /*css*/ `
                    #id .modal-lg, 
                    #id .modal-xl,
                    #id .modal-dialog {
                        max-width: initial !important;
                        margin: 40px !important;
                    }
                ` :
            ''}
            
            /* Passed in classes */
            /* #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 35px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                min-height: 50px;
            } */

            #id .modal-dialog-scrollable .modal-body {
                overflow-y: overlay;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 15px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                border: 4px solid transparent;
                border-radius: 20px;
                min-height: 75px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-button {
                height: 12px;
            }

            ${
                shadow ? 
                /* css */ `
                    #id .modal-content {
                        box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                    }
                ` : ''
            }

            /* No title */
            ${
                !title ?
                /*css*/ `
                    #id .modal-body::-webkit-scrollbar {
                        width: 60px;
                    }

                    #id .modal-body::-webkit-scrollbar-thumb {
                        border: 27px solid transparent;
                        border-radius: 60px;
                    }

                    #id .modal-body::-webkit-scrollbar-button {
                        height: 30px;
                    }
                ` : ''
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .btn`,
                event: 'click',
                listener(event) {
                    const button = buttons.footer.find(item => item.value === event.target.dataset.value);

                    if (button && button.onClick) {
                        button.onClick(event);
                    }
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).modal();

            if (addContent) {
                addContent(component.getModalBody());
            }

            // Draggable
            // $('.modal-header').on('mousedown', function(event) {
            //     const draggable = $(this);
            //     const extra = contentPadding ? parseInt(contentPadding.replace('px', '')) : 0;
            //     const x = event.pageX - ( draggable.offset().left - extra);
            //     const y = event.pageY - ( draggable.offset().top - extra);

            //     $('body').on('mousemove.draggable', function(event) {
            //         draggable.closest('.modal-content').offset({
            //             left: event.pageX - x,
            //             top: event.pageY - y
            //         });
            //     });

            //     $('body').one('mouseup', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     $('body').one('mouseleave', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     draggable.closest('.modal').one('bs.modal.hide', function() {
            //         $('body').off('mousemove.draggable');
            //     });
            // });

            /** Close listener */
            $(component.get()).on('hidden.bs.modal', function (e) {
                component.remove();
            });

            if (title) {
                /** Scroll listener */
                component.find('.modal-body').addEventListener('scroll', event => {
                    if (event.target.scrollTop > 0) {
                        event.target.style.borderTop = `solid 1px ${App.get('sidebarBorderColor')}`;
                    } else {
                        event.target.style.borderTop = `none`;
                    }
                });
            }
        }
    });

    function addFooterButtons() {
        let html = '';

        if (buttons && buttons.footer && Array.isArray(buttons.footer) && buttons.footer.length > 0) {
            // Delete button on left
            const deleteButton = buttons.footer.find(button => button.value.toLowerCase() === 'delete');

            if (deleteButton) {
                const { value, disabled, data, classes, inlineStyle } = deleteButton;
                html += /*html*/ `
                    <div style='flex: 2'>
                        <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                    </div>
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
        }

        return html;
    }

    function buildDataAttributes(data) {
        if (!data) {
            return '';
        }

        return data
            .map(attr => {
                const {
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.getHeader = () => {
        return component.find('.modal-header');
    };

    component.close = (onClose) => {
        if (onClose) {
            $(component.get()).on('hidden.bs.modal', event => {
                onClose(event);
            });
        }

        $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    component.setTitle = (text) => {
        const node = component.find('.modal-title');

        if (node) {
            node.innerHTML = text;
        }
    };

    return component;
}
// @END-File
