import {useEffect, useState} from "react";


function useFetch(endpoint, options) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(undefined)
    const [item, setItem] = useState(undefined)


    useEffect(() => {
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
            setLoading(false)
            setError(err)
        })

        return () => {
            setLoading(false)
            ac.abort()
        }
    }, [endpoint, ...Object.values(options)])

    return [
        item,
        setItem,
        loading,
        error
    ]
}


export {useFetch}