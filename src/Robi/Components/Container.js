import { Component } from '../Actions/Component.js'
import { Shimmer } from '../Actions/Shimmer.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Container(param) {
    const {
        name,
        html,
        align,
        background,
        border,
        borderBottom,
        borderLeft,
        borderRight,
        borderTop,
        classes,
        display,
        flex,
        flexwrap,
        shadow,
        direction,
        height,
        justify,
        margin,
        padding,
        parent,
        position,
        radius,
        width,
        maxHeight,
        minHeight,
        maxWidth,
        minWidth,
        overflow,
        overflowX,
        overflowY,
        userSelect,
        layoutPosition,
        transition,
        top,
        bottom,
        left,
        right,
        zIndex,
        shimmer
    } = param;

    let unsubscribeShimmer;

    const component = Component({
        html: /*html*/ `
            <div class='container${classes ? ` ${classes?.join(' ')}` : ''}' data-name='${name || ''}'>${html || ''}</div>
        `,
        style: /*css*/ `
            #id {
                user-select: ${userSelect || 'initial'};
                -webkit-user-select: ${userSelect || 'initial'};
                -moz-user-select: ${userSelect || 'initial'};
                -ms-user-select: ${userSelect || 'initial'};
                background-color: ${background || 'unset'};
                flex-wrap: ${flexwrap || 'unset'};
                flex-direction: ${direction || 'row'};
                justify-content: ${justify || 'flex-start'};
                align-items: ${align || 'flex-start'};
                height: ${height || 'unset'};
                width: ${width || 'unset'};
                max-height: ${maxHeight || 'unset'};
                min-height: ${minHeight || 'unset'};
                max-width: ${maxWidth || 'unset'};
                min-width: ${minWidth || 'unset'};
                margin: ${margin || '0'};
                padding: ${padding || '0'};
                border-radius: ${radius || 'unset'};
                border: ${border || 'initial'};
                border-top: ${borderTop || 'none'};
                border-right: ${borderRight || 'none'};
                border-bottom: ${borderBottom || 'none'};
                border-left: ${borderLeft || 'none'};
                box-shadow: ${shadow || 'none'};
                flex: ${flex || 'unset'};
                display: ${display || 'flex'};
                /** @todo is this the best method? */
                ${background ?
                `background: ${background};` :
                ''}
                ${overflow ?
                `overflow: ${overflow}` :
                ''}
                ${overflowX ?
                `overflow-x: ${overflowX}` :
                ''}
                ${overflowY ?
                `overflow-y: ${overflowY}` :
                ''}
                ${zIndex ?
                `z-index: ${zIndex};` :
                ''}
                ${layoutPosition ?
                `position: ${layoutPosition};` :
                ''}
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
                ${transition ? `transition: ${transition};` : ''}
            }

            #id.robi-row {
                width: 100%;
                display: block;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            if (shimmer) {
                unsubscribeShimmer = Shimmer(component, { backgroundColor: background || 'var(--background)'});
            }
        }
    });

    component.shimmerOff = () => {
        unsubscribeShimmer.off();
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = '40px'; // 15px 30px;
    };

    return component;
}
// @END-File
