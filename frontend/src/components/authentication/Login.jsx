import React, {useContext, useState} from "react";
import {TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {CustomerContext} from "../../util/context/CustomerContext";
import {AuthenticationFormContainer} from "./AuthenticationFormContainer";

export function Login() {
    // TODO broken links

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // @type "buyer" | "shopper"
    const [loginType, setLoginType] = useState("buyer")

    const {login} = useContext(CustomerContext)

    return <AuthenticationFormContainer
        title={loginType === "buyer" ? "Login as Buyer" : "Login as Shopper"}
        altLink={`/${loginType}/signup`}
        altText={"...or signup instead"}
        onSubmit={async () => await login(email, password, loginType)}
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

        <ToggleButtonGroup
            value={loginType}
            exclusive
            sx={{
                "marginTop": "8px",
                "minHeight": "2.3rem"
            }}
            variant="contained"
            aria-label="Choose customer type button"
            onChange={(e, v) => {
                if (v) {
                    setLoginType(v)
                }
            }}>
            <ToggleButton value={"buyer"} sx={{
                "flexGrow": 1,
                "padding": 0,
                "&.Mui-selected": {
                    "backgroundColor": "primary.dark",
                    "color": "white"
                },
                "&:hover": {
                    color: "text.main",
                    borderColor: "text.main"
                }
            }}>Login as Buyer</ToggleButton>

            <ToggleButton value={"shopper"} sx={{
                "flexGrow": 1,
                "padding": 0,
                "&.Mui-selected": {
                    "backgroundColor": "primary.dark",
                    "color": "white"
                },
                "&:hover": {
                    color: "text.main",
                    borderColor: "text.main"
                }
            }}>Login as Shopper</ToggleButton>
        </ToggleButtonGroup>
    </AuthenticationFormContainer>
}