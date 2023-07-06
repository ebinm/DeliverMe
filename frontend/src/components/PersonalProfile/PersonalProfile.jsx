import React, {useContext, useEffect, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Navigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import {Box, CircularProgress, Paper} from "@mui/material";
import MuiPhoneNumber from 'material-ui-phone-number';
import TextField from "@mui/material/TextField";
import {CustomFileInput} from "../util/CustomFileUpload";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {InfoPopover} from "../util/InfoPopover";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {DarkButton} from "../util/Buttons";
import {Show} from "../util/ControlFlow";
import {GuardCustomerType} from "../util/GuardCustomerType";

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

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)


    useEffect(() => {
        if (ready && customer) {
            setFirstName(customer.firstName)
            setLastName(customer.lastName)
            setPhoneNumber(customer.phoneNumber)
            setProfilePicture(customer.profilePicture)
        }
    }, [customer, ready])

    if (!ready) {
        return <CircularProgress sx={{color: "primary.dark"}}/>
    }

    if (!customer) {
        return <Navigate to={"/"}/>
    }

    const otherGroup = (customer.type === "BUYER") ? "shopper" : "buyer"


    return (
        <GuardCustomerType requiredType={undefined}>{() =>
            <Stack alignItems={"center"} justifyContent={"center"}
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

                        <MuiPhoneNumber value={phoneNumber} variant={"outlined"} label={"Phone Number"}
                                        defaultCountry={"de"}
                                        onChange={v => setPhoneNumber(v)}
                                        onlyCountries={["de", "gb"]} InputProps={{
                            endAdornment: <InfoPopover><Typography variant={"body1"}>Adding a phone number will
                                allow {otherGroup}s to contact you more easily if questions
                                arise.</Typography></InfoPopover>
                        }}/>

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
                                    firstName, lastName, profilePicture, phoneNumber
                                })
                            } catch {
                                setError("An unknown error occured. Please try again later")
                                setLoading(false)
                                return
                            }
                            setLoading(false)
                            // Yes, this is a hack instead of reloading the customer from the customer context.
                            // window.location.reload()
                            invalidate()

                        }}>
                            <Show when={!loading} fallback={<CircularProgress size={"1.5rem"}/>}>
                                Save
                            </Show>
                        </DarkButton>
                    </Stack>
                </Paper>
            </Stack>
        }</GuardCustomerType>
    )
}
