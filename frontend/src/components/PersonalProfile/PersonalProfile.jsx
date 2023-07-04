import React, {useContext, useEffect, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Navigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import {CircularProgress, FormControl, InputLabel, Paper} from "@mui/material";
import MuiPhoneNumber from 'material-ui-phone-number';
import TextField from "@mui/material/TextField";
import {CustomFileInput} from "../util/CustomFileUpload";

export function PersonalProfile() {

    const {customer, ready} = useContext(CustomerContext)

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [profilePicture, setProfilePicture] = useState()


    const [uploadFeedback, setUploadFeedback] = useState()

    useEffect(() => {
        setFirstName(customer.firstName)
        setLastName(customer.lastName)
        setPhoneNumber(customer.phoneNumber)
        setProfilePicture(customer.profilePicture)
    }, [customer])

    if (!ready) {
        return <CircularProgress sx={{color: "primary.dark"}}/>
    }

    if (!customer) {
        return <Navigate to={"/"}/>
    }

    const otherGroup = (customer.type === "BUYER") ? "shopper" : "buyer"

    return <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"10=%"}>
        <Paper>
            <form>

                <Stack>

                    <MuiPhoneNumber label={"Phone Number"} defaultCountry={"de"} onlyCountries={["de", "gb"]}/>
                    <TextField label={"First Name"}/>
                    <TextField label={"Last Name Name"}/>

                    <FormControl direction={"column"}>
                        <InputLabel>Profile Picture</InputLabel>
                        <CustomFileInput img={profilePicture} setImg={setProfilePicture}/>
                    </FormControl>

                </Stack>
            </form>
        </Paper>
    </Stack>

}
