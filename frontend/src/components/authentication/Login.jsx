import React, {useContext, useState} from "react";
import {TextField} from "@mui/material";
import {CustomerContext} from "../../util/context/CustomerContext";
import {AuthenticationFormContainer} from "./AuthenticationFormContainer";

export function Login() {
    // TODO broken links

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const {login} = useContext(CustomerContext)

    return <AuthenticationFormContainer
        title={"Login"}
        altLink={"/buyer/signup"}
        altText={"...or signup instead"}
        onSubmit={async () => await login(email, password, "buyer")}
        actionText={"Login"}
    >
            <TextField
                id="email-input"
                label="Email"
                type="email"
                variant="standard"
                required={true}
                onChange={e => setEmail(e.currentTarget.value)}
                value={email}
            />

            <TextField
                id="password-input"
                label="Password"
                type="password"
                variant="standard"
                required={true}
                onChange={e => setPassword(e.currentTarget.value)}
                value={password}
            />
    </AuthenticationFormContainer>
}