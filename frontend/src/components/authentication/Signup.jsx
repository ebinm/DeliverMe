import React, {useContext, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {AuthenticationFormContainer} from "./AuthenticationFormContainer";
import {TextField} from "@mui/material";
import {CustomFileInput} from "../util/CustomFileUpload";
import {Show} from "../util/ControlFlow";
import {InfoPopper} from "../util/HoverPopper";
import Typography from "@mui/material/Typography";


/**
 *
 * @param type {"buyer" | "shopper"}
 * @returns {JSX.Element}
 * @constructor
 */
export function Signup({type}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [paypalAccount, setPaypalAccount] = useState("")


    const {signup} = useContext(CustomerContext)

    return <AuthenticationFormContainer title={`Sign up as a ${type === "buyer" ? "Buyer" : "Shopper"}`}
                                        onSubmit={async () => signup(email, password1, firstName, lastName, profilePicture, paypalAccount, type)}
                                        altText={"...or login instead"}
                                        altLink={"/login"}
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

        <Show when={type === "shopper"}>
            <TextField
                required={true}
                variant="standard"
                value={paypalAccount} label={"PayPal Account"}
                onChange={e => setPaypalAccount(e.target.value)} InputProps={{
                endAdornment: <InfoPopper><Typography variant={"body1"}>This will be used to pay your fee
                    to you.</Typography></InfoPopper>
            }}/>
        </Show>

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


        <CustomFileInput defaultLabel={"Upload or drop your profile picture here."} img={profilePicture}
                         setImg={setProfilePicture}/>

    </AuthenticationFormContainer>

}