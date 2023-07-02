import React, {useContext, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {AuthenticationFormContainer} from "./AuthenticationFormContainer";
import {TextField, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import {FileUploader} from "react-drag-drop-files";


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

    const [uploadFeedback, setUploadFeedback] = useState("Upload or drop your profile picture here.")


    const {signup} = useContext(CustomerContext)

    return <AuthenticationFormContainer title={`Sign up as a ${type === "buyer" ? "Buyer" : "Shopper"}`}
                                        onSubmit={async () => signup(email, password1, firstName, lastName, profilePicture, type)}
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

        <FileUploader maxSize={32} id={"receipt"}
                      required={false} multiple={false} name="file" types={["JPG", "PNG"]}
                      onTypeError={(err) => setUploadFeedback(err)}
                      onSizeError={(err) => setUploadFeedback(err)}
                      handleChange={(file) => {
                          const fileReader = new FileReader();
                          fileReader.onload = () => {
                              // const result = fileReader.result
                              // const index = result.indexOf(",") + 1
                              setProfilePicture(fileReader.result)
                              setUploadFeedback("Successfully uploaded. (Upload again to replace)")
                          }
                          fileReader.readAsDataURL(file)
                      }}
        >
            <Stack direction={"column"} gap={"16px"} justifyContent={"center"}
                   alignItems={"center"} sx={{
                "marginTop": "16px",
                "borderWidth": "3px",
                "borderStyle": "dashed",
                "borderRadius": "16px",
                "padding": "16px",
                "borderColor": "primary.dark"
            }}>
                <CloudUploadIcon sx={{"color": "primary.dark", "fontSize": "2rem"}}/>
                <Typography sx={{"color": "primary.dark"}}> {uploadFeedback}</Typography>
                <Box component={"img"} src={profilePicture} sx={{"maxHeight": "10vh"}}/>
            </Stack>
        </FileUploader>

    </AuthenticationFormContainer>

}