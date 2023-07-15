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
        },
        orange: "#FFAC33"
    },
    components: {


        MuiInputLabel: {
            defaultProps: {
                sx: {
                    "color": "text.main",
                    "&.Mui-focused": {
                        "color": "primary.dark",
                    }
                }
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: '#ECF2E3',
                    },
                },
            },
        },
    },
})

export {deliverMeTheme}