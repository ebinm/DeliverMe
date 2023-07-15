import {createContext, useCallback, useState} from "react";
import {useFetch} from "../hooks";
import {PUT_FETCH_OPTIONS} from "../util";

/**
 * The customer context and provider provide the logged in customer and offer methods for login in and
 * signing up new users.
 *
 * @type {React.Context<{logout: undefined, ready: boolean, invalidate: undefined, login: undefined, signup: undefined, customer: undefined}>}
 */


// @type Context<{login: () => Promise<{msg: string}> | undefined, signup: () => Promise<{msg: string} | undefined, customer: {firstName: string, lastName: string, email: string, type: "BUYER" | "SHOPPER"} | undefined }>}>
const CustomerContext = createContext({
    login: undefined,
    signup: undefined,
    customer: undefined,
    logout: undefined,
    invalidate: undefined,
    ready: false
})

function fetchUser(setCustomer) {
    return fetch(`${process.env.REACT_APP_BACKEND}/api/me`, {
        credentials: "include",
        withCredentials: true
    })
        .then(async res => {
            if (res.ok) {
                setCustomer(await res.json())
            }
        })
}

function CustomerProvider({children}) {

    // I am sorry for this. Endpoint is technically static but we change it to trigger a refetch
    const [finishedOnce, setFinishedOnce] = useState(false)

    const onFinallyFetch = useCallback(() => setFinishedOnce(true), [setFinishedOnce])
    const [customer, setCustomer, loading,, refetch] = useFetch(`${process.env.REACT_APP_BACKEND}/api/me`, {
        credentials: "include",
        withCredentials: true
    }, undefined, onFinallyFetch)


    // type: "shopper" | "buyer"
    // ...my god I miss TypeScript
    async function login(email, password, type) {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/${type}/login`, {
            ...PUT_FETCH_OPTIONS,
            method: "POST", body: JSON.stringify({
                email, password
            })
        })

        if (!res.ok) {
            return (await res.json()).msg || "Unknown Error"
        }

        // TODO dont set customer if unmounted
        await fetchUser(setCustomer)
    }

    async function signup(email, password, firstName, lastName, profilePicture, paypalAccount, type) {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/${type}/signup`, {
            ...PUT_FETCH_OPTIONS,
            method: "POST", body: JSON.stringify({
                email, password, firstName, lastName, profilePicture, paypalAccount
            })
        })

        if (!res.ok) {
            return (await res.json()).msg || "Unknown Error"
        }

        // TODO dont set customer if unmounted
        await fetchUser(setCustomer)
    }

    function logout() {
        document.cookie = "jwt=;path=/;Max-Age=0"
        window.location.reload()
    }

    return <CustomerContext.Provider value={{
        login,
        signup,
        customer,
        logout,
        invalidate: refetch,
        ready: finishedOnce && !loading
    }}>
        {children}
    </CustomerContext.Provider>

}

export {
    CustomerContext,
    CustomerProvider
}