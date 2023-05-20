import "./index.scss"
import App from './App';
import {deliverMeTheme} from "./config/themes";
import {ThemeProvider} from "@mui/material/styles"
import {createRoot} from "react-dom/client"
import React from "react";
import {BrowserRouter} from "react-router-dom";


const root = createRoot(document.getElementById("root"))

root.render(
    <React.StrictMode>
        <ThemeProvider theme={deliverMeTheme}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);