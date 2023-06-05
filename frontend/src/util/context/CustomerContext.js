import {createContext, useState} from "react";
import {useFetch} from "../hooks";

// @type Context<{login: () => Promise<{msg: string}> | undefined, signup: () => Promise<{msg: string} | undefined, customer: {firstName: string, lastName: string, email: string, type: "BUYER" | "SHOPPER"} | undefined }>}>
const CustomerContext = createContext({
    login: undefined,
    signup: undefined,
    customer: undefined,
    logout: undefined,
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

    const [finishedOnce, setFinishedOnce] = useState(false)
    const [customer, setCustomer, loading] = useFetch(`${process.env.REACT_APP_BACKEND}/api/me`, {
        credentials: "include",
        withCredentials: true
    }, undefined, () => setFinishedOnce(true))


    // type: "shopper" | "buyer"
    // ...my god I miss TypeScript
    async function login(email, password, type) {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/${type}/login`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
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

    async function signup(email, password, firstName, lastName, type) {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/${type}/signup`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            method: "POST", body: JSON.stringify({
                email, password, firstName, lastName
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
        ready: finishedOnce && !loading
    }}>
        {children}
    </CustomerContext.Provider>

}

export {
    CustomerContext,
    CustomerProvider
}