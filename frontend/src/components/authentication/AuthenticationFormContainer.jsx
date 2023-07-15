import {Box, Button, CircularProgress, FormGroup, Link, Typography} from "@mui/material";
import React, {useState} from "react";
import {Show} from "../util/ControlFlow";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";


export function AuthenticationFormContainer({onSubmit, title, children, altText, altLink, actionText}) {

    const navigate = useNavigate()

    const [searchParams,] = useSearchParams()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    return <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}
                bgcolor={"primary.light"}>
        <Box width={"600px"} padding={"20px"} boxShadow={1} borderRadius={"8px"} height={"min-content"}
             backgroundColor={"white"}>
            <form onSubmit={async e => {
                e.preventDefault()

                setLoading(true)
                const err = await onSubmit()
                setLoading(false)

                if (err) {
                    setError(err)
                } else {
                    navigate(searchParams.get("ref") || "/")
                }
            }}>
                <Typography sx={{"marginBottom": "8px"}} variant={"h5"}>{title}</Typography>

                <FormGroup sx={{gap: "6px"}}>
                    {children}

                    <Button type={"submit"} variant={"outlined"} sx={{
                        width: "100%", color: "white", bgcolor: "primary.dark",
                        "margin": "12px 0",
                        "&:hover": {
                            color: "text.main",
                            borderColor: "text.main"
                        }
                    }}>

                        <Show when={!loading} fallback={<CircularProgress size={"1.5rem"}/>}>
                            {actionText}
                        </Show>
                    </Button>


                    <Link color={"text.main"} alignSelf={"center"} href={altLink + "?" + createSearchParams({
                        "ref": searchParams.get("ref") || ""
                    }).toString()}>{altText}</Link>

                    <Show when={error}>
                        <Box marginTop={"16px"} alignSelf={"center"}><strong>{error}</strong></Box>
                    </Show>
                </FormGroup>
            </form>
        </Box>
    </Box>
}