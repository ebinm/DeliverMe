import {useCallback, useContext, useEffect, useState} from "react";
import {tryLoadFromLocalStorage} from "./util";
import {CustomerContext} from "./context/CustomerContext";


function useFetch(endpoint, options, onSuccess = undefined, onFinally = undefined) {

    // A note on the loading state: We do not consider abortions to be errors as they trigger
    // an instant refetch. This allows us to keep consistent state, even in the face of React's strict mode
    // which forces useEffects cleanup to run. The default of loading false seems weird but it allows
    // us to deduce the loading state more easily
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [item, setItem] = useState(undefined)

    useEffect(() => {
        if (!endpoint) {
            return
        }

        const ac = new AbortController()
        setLoading(true)
        setError(undefined)
        fetch(endpoint, {signal: ac.signal, ...options})
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

        return () => {
            ac.abort()
            setLoading(false)
            setError({msg: "Aborted fetch"})
        }
    }, [endpoint, JSON.stringify(options)])

    return [
        item,
        setItem,
        loading,
        error
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
        } else {
            window.localStorage.setItem(`${key}-default`, null)
        }
    }, [key, customer?._id])

    return [value, setValue, clear]
}


export {useFetch, useCacheLocalStorageForCustomer}