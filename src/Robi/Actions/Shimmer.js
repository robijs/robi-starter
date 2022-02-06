import { Style } from './Style.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Shimmer(component, options = {}) {
    const { backgroundColor } = options;
    const id = component.get().id;

    // TODO: Set animation time on viewport width
    // TODO: Set linear-gradient on viewport width
    Style({
        name: `shimmer-animation-${id}`,
        style: /*css*/ `
            #${id}.shimmer-${id} {
                position: relative;
                border-radius: 20px;
                ${backgroundColor ? `background-color: ${backgroundColor};` : ''}
            }

            #${id}.shimmer-${id}::after {
                border-radius: 0px;
                position: absolute;
                width: 100%;
                height: 100%;
                content: ' ';
                top: 0px;
                left: 0px;
                background: linear-gradient(to right, transparent 0%, var(--secondary) 20%, transparent 40%, transparent 100%);
                background-repeat: no-repeat;
                background-size: var(--shimmer-size-${id}) 100%;
                animation: shimmer 1200ms infinite linear;
            }
                
            @-webkit-keyframes shimmer {
                0% {
                    background-position: calc(var(--shimmer-size-${id}) * -1) 0;
                }
            
                100% {
                    background-position: var(--shimmer-size-${id}) 0;
                }
            }
        `
    });

    Style({
        name: `shimmer-variables-${id}`,
        style: /*css*/ `
            :root {
                --shimmer-size-${id}: ${component.get().offsetWidth}px;
            }
        `
    });

    // TODO: Keep track of all event listeners added to the window, remove on route changes
    // Window resize event
    window.addEventListener('resize', setShimmerSize);

    function setShimmerSize() {
        Style({
            name: `shimmer-variables-${id}`,
            style: /*css*/ `
                :root {
                    --shimmer-size-${id}: ${component.get().offsetWidth}px;
                }
            `
        });
    }

    component.get().classList.add(`shimmer-${id}`);

    return {
        off() {
            document.querySelector(`style[data-name='shimmer-animation-${id}']`)?.remove();
            document.querySelector(`style[data-name='shimmer-variables-${id}']`)?.remove();

            component.get()?.classList.remove(`shimmer-${id}`);

            window.removeEventListener('resize', setShimmerSize);
        }
    }
}
// @END-File
