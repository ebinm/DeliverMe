import React, {useContext, useState} from "react";

import {TextField} from "@mui/material";
import {CustomerContext} from "../../util/context/CustomerContext";
import {AuthenticationFormContainer} from "./AuthenticationFormContainer";

export function SignupShopper() {


    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")

    const {signup} = useContext(CustomerContext)

    //

    return <AuthenticationFormContainer title={"Login"}
                                        onSubmit={async () => signup(email, password1, firstName, lastName, "personal-shopper")}
                                        altText={"...or login instead"}
                                        altLink={"/personal-shopper/login"}
                                        actionText={"Signup"}>

                    <TextField
                        id="first-name-input"
                        label="First Name"
                        variant="standard"
                        required={true}
                        onChange={e => setFirstName(e.currentTarget.value)}
                        value={firstName}
                    />

                    <TextField
                        id="last-name-input"
                        label="Last Name"
                        variant="standard"
                        required={true}
                        onChange={e => setLastName(e.currentTarget.value)}
                        value={lastName}
                    />

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
                        onChange={e => setPassword1(e.currentTarget.value)}
                        value={password1}
                    />

                    <TextField
                        id="password-repeat-input"
                        label="Repeat password"
                        error={password1 !== password2}
                        helperText={password1 !== password2 ? "Passwords differ" : undefined}
                        type="password"
                        variant="standard"
                        required={true}
                        onChange={e => setPassword2(e.currentTarget.value)}
                        value={password2}
                    />
    </AuthenticationFormContainer>
}