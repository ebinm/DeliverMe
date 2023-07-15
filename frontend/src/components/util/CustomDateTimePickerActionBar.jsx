import React from "react";
import {Button, DialogActions} from "@mui/material";
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {darkButtonSx, outlinedButtonSx} from "./Buttons"

function CustomDateTimePickerActionBar(props) {
    const {onAccept, onClear, onCancel, onSetToday, actions, ...other} = props;

    const localeText = useLocaleText();

    return <DialogActions {...other}>
        <Button sx={outlinedButtonSx} onClick={onClear}>{localeText.clearButtonLabel}</Button>
        <Button sx={darkButtonSx} onClick={onAccept}>{localeText.okButtonLabel}</Button>
    </DialogActions>
}

export {CustomDateTimePickerActionBar};