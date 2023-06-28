import React, {useContext} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {CircularProgress} from "@mui/material";
import {createSearchParams, Navigate, useLocation} from "react-router-dom";


/**
 * Makes sure that the current customer has the right type.

 *
 * @param children The actual component. Use a function if you do not want it to be rendered if the user is not logged in (recommended).
 * @param requiredType The required type.
 * @param navigateOnInvalidType A location to navigate to if the user is incorrect.
 */
export function GuardCustomerType({children, requiredType, navigateOnInvalidType = "/"}) {
    const {customer, ready} = useContext(CustomerContext)
    const location = useLocation()

    if (!ready) {
        return <CircularProgress/>
    }

    if (!customer) {
        return <Navigate to={{
            pathname: `/${requiredType.toLowerCase()}/signup`,
            search: createSearchParams({
                "ref": location.pathname
            }).toString()
        }}/>
    }

    if (customer.type !== requiredType) {
        return <Navigate to={navigateOnInvalidType}/>
    }

    if (typeof children === 'function') {
        return <>{children()}</>
    } else {
        return <>{children}</>
    }

}