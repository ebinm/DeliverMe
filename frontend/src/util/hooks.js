import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {tryLoadFromLocalStorage} from "./util";
import {CustomerContext} from "./context/CustomerContext";


/**
 * Important: Memoize the onSuccess and onFinally methods.
 *
 * @returns An array of the items, a local set state function, the loading state, an error object, a refetch function
 */
function useFetch(endpoint, options = {}, onSuccess = undefined, onFinally = undefined) {

    // A note on the loading state: We do not consider abortions to be errors as they trigger
    // an instant refetch. This allows us to keep consistent state, even in the face of React's strict mode
    // which forces useEffects cleanup to run. The default of loading false seems weird but it allows
    // us to deduce the loading state more easily
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [item, setItem] = useState(undefined)

    const abortControllerRef = useRef()

    const callFetch = useCallback(async function callFetch() {
            if (!endpoint) {
                return
            }

            abortControllerRef.current?.abort()
            const ac = new AbortController()
            abortControllerRef.current = ac
            setLoading(true)
            setError(undefined)
            await fetch(endpoint, {signal: ac.signal, ...options})
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        return res.json()
                            .then(err => setError(err))
                            .then(() => Promise.reject())
                    }
                }).then(res => {
                    setItem(res)
                    onSuccess && onSuccess()
                    setError(undefined)
                    setLoading(false)
                }).catch(err => {
                    setError(err)
                    if (!ac.signal.aborted) {
                        setLoading(false)
                    }
                }).finally(() => {
                    onFinally && onFinally()
                })
        }, [endpoint, onFinally, onSuccess, JSON.stringify(options)])

    useEffect(() => {
        callFetch()

        return () => {
            abortControllerRef.current?.abort()
            setLoading(false)
            setError({msg: "Aborted fetch"})
        }
    }, [endpoint, JSON.stringify(options), callFetch])

    return [
        item,
        setItem,
        loading,
        error,
        callFetch
    ]
}

function useCacheLocalStorageForCustomer(key, initialState = null, storageCondition = (_) => true) {
    const {customer} = useContext(CustomerContext)
    const [value, setValue] = useState(initialState)

    useEffect(() => {
        if (customer?._id) {
            const success = tryLoadFromLocalStorage(`${key}-${customer._id}`, setValue, initialState)
            if (!success) {
                tryLoadFromLocalStorage(`${key}-default`, setValue, initialState)
            }
        } else {
            tryLoadFromLocalStorage(`${key}-default`, setValue, initialState)
        }
    }, [customer?._id])

    useEffect(() => {
        if (!storageCondition(value)) {
            return
        }

        if (customer?._id) {
            window.localStorage.setItem(`${key}-${customer._id}`, JSON.stringify(value))
        } else {
            window.localStorage.setItem(`${key}-default`, JSON.stringify(value))
        }
    }, [customer?._id, value, storageCondition(value)])

    const clear = useCallback(() => {
        if (customer?._id) {
            window.localStorage.setItem(`${key}-${customer._id}`, null)
        }
        window.localStorage.setItem(`${key}-default`, null)

    }, [key, customer?._id])

    return [value, setValue, clear]
}

function useExternalScripts(url, channelId, token, id) {
    useEffect(() => {
        const head = document.querySelector("head");
        const script = document.createElement("script");

        script.setAttribute("src", url);
        script.setAttribute("channelId", channelId);
        script.setAttribute("token", token);
        script.setAttribute("id", id);
        head.appendChild(script);

        return () => {
            head.removeChild(script);
        };
    }, [url]);
}

export {useFetch, useCacheLocalStorageForCustomer, useExternalScripts}