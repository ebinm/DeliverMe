/**
 * This file contains components that mimic some of the APIs provided by SolidJS (https://www.solidjs.com/docs/latest)
 * as I (Lukas Rossi) find them more pleasant to work with
 */


/**
 * A simple Ripoff of SolidJS's <Show/> Component
 *
 * @template T
 * @param children {JSX.Element | (resolved: T) => JSX.Element}
 * @param when {T | undefined | false}
 * @param fallback {JSX.Element}
 * @returns {JSX.Element}
 * @constructor
 */
function Show({children, when, fallback}) {
    const isFunction = typeof children === "function"

    return <>{
        when ? (isFunction ? children(when) : children) : fallback
    }</>
}


/**
 * A simple Ripoff of SolidJS's <For/> Component
 *
 * @template T
 * @param children {(item: T) => JSX.Element}
 * @param each  {T[] | undefined | false}
 * @param fallback {JSX.Element}
 * @returns {JSX.Element}
 * @constructor
 */
function For({children, each, fallback}) {
    if (fallback && (!each || each.length === 0)) {
        return fallback
    }

    return <>
        {
            each.map(children)
        }
    </>
}


export {
    For, Show
}