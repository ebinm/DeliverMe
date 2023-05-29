import {createTheme} from "@mui/material/styles"


const deliverMeTheme = createTheme({
    palette: {
        primary: {
            main: "#ECF2E3"
        },
        text: {
            primary: "#3F4B3F"
        }
    },
    components: {
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