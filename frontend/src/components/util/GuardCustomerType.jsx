import React, {useContext} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {CircularProgress} from "@mui/material";
import {createSearchParams, Navigate, useLocation} from "react-router-dom";


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

    return <>{children}</>
}