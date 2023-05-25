import {createContext} from "react";


const CustomerContext = createContext({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    id: undefined,
    type: undefined
})

function CustomerProvider({children}){

    

    return <CustomerContext.Provider value={{

    }}>
        {children}
    </CustomerContext.Provider>

}