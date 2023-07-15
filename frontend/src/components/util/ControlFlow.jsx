/**
 * This file contains components that mimic some of the APIs provided by SolidJS (https://www.solidjs.com/docs/latest)
 * as I (Lukas Rossi) find them more pleasant to work with
 */


/**
 * A simple Ripoff of SolidJS's <Show/> Component.
 *
 * Problems: children are evaluate eagerly which might be a problem if there is
 * a dependency on the when. Use function children to circumvent this problem
 *
 * @template T
 * @param children {JSX.Element | ((resolved: T) => JSX.Element)}
 * @param when {T | undefined | false}
 * @param fallback {JSX.Element | ((item: T) => JSX.Element)}
 * @returns {JSX.Element}
 * @constructor
 */
function Show({children, when, fallback}) {
    return <>{
        when ? (typeof children === "function" ? children(when) : children) : (typeof fallback === "function" ? fallback() : fallback)
    }</>
}


/**
 * A simple Ripoff of SolidJS's <For/> Component
 *
 * @template T
 * @param children {(item: T) => JSX.Element}
 * @param each  {T[] | undefined | false}
 * @param fallback {JSX.Element | ((item: T) => JSX.Element)}
 * @returns {JSX.Element}
 * @constructor
 */
function For({children, each, fallback}) {
    if (fallback && (!each || each.length === 0)) {
        if(typeof fallback === "function"){
            return fallback()
        }
        return fallback
    }

    if(!each){
        return <></>
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