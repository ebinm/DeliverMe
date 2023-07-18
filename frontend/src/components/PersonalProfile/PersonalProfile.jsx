import React, {useContext, useEffect, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Navigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import {Box, CircularProgress, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import {CustomFileInput} from "../util/CustomFileUpload";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {InfoPopper} from "../util/HoverPopper";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {DarkButton} from "../util/Buttons";
import {Show} from "../util/ControlFlow";
import {GuardCustomerType} from "../util/GuardCustomerType";
import {MuiTelInput} from "mui-tel-input"

async function updateProfile(body) {
    return (await fetch(`${process.env.REACT_APP_BACKEND}/api/me`, {
        ...PUT_FETCH_OPTIONS, method: "PATCH", body: JSON.stringify(body)
    }).then(res => res.json()))
}

export function PersonalProfile() {

    const {customer, ready, invalidate} = useContext(CustomerContext)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [profilePicture, setProfilePicture] = useState()
    const [paypalAccount, setPaypalAccount] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)


    useEffect(() => {
        if (ready && customer) {
            setFirstName(customer.firstName)
            setLastName(customer.lastName)
            setPhoneNumber(customer.phoneNumber || "")
            setProfilePicture(customer.profilePicture)
            setPaypalAccount(customer.paypalAccount || "")
        }
    }, [customer, ready])

    if (!ready) {
        return <CircularProgress sx={{color: "primary.dark"}}/>
    }

    if (!customer) {
        return <Navigate to={"/"}/>
    }

    const otherGroup = (customer.type === "BUYER") ? "shopper" : "buyer"


    return (<GuardCustomerType requiredType={undefined}>{() => <Stack alignItems={"center"} justifyContent={"center"}
                                                                      width={"100%"} height={"10=%"}>
        <Paper sx={{"padding": "16px"}}>
            <Typography variant={"h4"} component={"h2"}>Personal Profile</Typography>
            <Divider sx={{"margin": "8px 0 16px 0"}}/>
            <Stack gap={"16px"}>
                <TextField
                    value={firstName} label={"First Name"}
                    onChange={e => setFirstName(e.target.value)}/>
                <TextField value={lastName} label={"Last Name"}
                           onChange={e => setLastName(e.target.value)}/>

                <MuiTelInput value={phoneNumber || ""} variant={"outlined"} label={"Phone Number"}
                             defaultCountry={"DE"}
                             onChange={v => setPhoneNumber(v)}
                             preferredCountries={["DE", "GB"]} InputProps={{
                    endAdornment: <InfoPopper><Typography variant={"body1"}>Adding a phone number will
                        allow {otherGroup}s to contact you more easily if questions
                        arise.</Typography></InfoPopper>
                }}/>

                <Show when={customer.type === "SHOPPER"}>
                    <TextField
                        value={paypalAccount} label={"PayPal Account"}
                        onChange={e => setPaypalAccount(e.target.value)} InputProps={{
                        endAdornment: <InfoPopper><Typography variant={"body1"}>This will be used to pay your fee
                            to you.</Typography></InfoPopper>
                    }}/>
                </Show>

                <CustomFileInput defaultLabel={"Upload or drop your profile picture here."} img={profilePicture}
                                 setImg={setProfilePicture}/>

                <Show when={error}>
                    <Box marginTop={"16px"} alignSelf={"center"}><strong>{error}</strong></Box>
                </Show>

                <DarkButton sx={{"width": "100%"}} onClick={async () => {
                    if (loading) {
                        return
                    }

                    setError(undefined)
                    setLoading(true)
                    try {
                        await updateProfile({
                            // TODO client side validation
                            // TODO error handling
                            firstName, lastName, profilePicture, phoneNumber, paypalAccount
                        })
                    } catch {
                        setError("An unknown error occured. Please try again later")
                        setLoading(false)
                        return
                    }
                    setLoading(false)
                    invalidate()
                }}>
                    <Show when={!loading} fallback={<CircularProgress size={"1.5rem"}/>}>
                        Save
                    </Show>
                </DarkButton>
            </Stack>
        </Paper>
    </Stack>}</GuardCustomerType>)
}
