import {createTheme} from "@mui/material/styles"


const deliverMeTheme = createTheme({
    palette: {
        primary: {
            light: "#F0F3EB",
            main: "#ECF2E3",
            dark: "#AAC0AA"
        },
        text: {
            light: "#ACACAC",
            main: "#3F4B3F"
        },
        selected: {
            light: "#E3EEFF",
            main: "#D8E7FF"
        }
    }
})

export {deliverMeTheme}