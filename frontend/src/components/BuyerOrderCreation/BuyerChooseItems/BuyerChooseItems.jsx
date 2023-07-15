import Typography from "@mui/material/Typography";
import {Box, Paper, Popover} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Divider from "@mui/material/Divider";
import {Show} from "../../util/ControlFlow";
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import {DateTimePicker} from "@mui/x-date-pickers";
import React, {useCallback, useMemo, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {DarkButton, OutlinedButton} from "../../util/Buttons";
import {CustomDateTimePickerActionBar} from "../../util/CustomDateTimePickerActionBar";
import moment from "moment";
import {DesktopItemTable} from "./DesktopItemTable";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from "@mui/system";
import {MobileItemTable} from "./MobileItemTable";
import ReportIcon from '@mui/icons-material/Report';

export function BuyerChooseItems({
                                     shop,
                                     onSubmit,
                                     onGoBack,
                                     to,
                                     setTo,
                                     from,
                                     setFrom,
                                     items,
                                     setItems,
                                     notes,
                                     setNotes
                                 }) {

    const formRef = useRef()

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("sm"))

    const [fromErr, setFromErr] = useState(false)
    const [toErr, setToErr] = useState(false)

    const setItemsSimple = useCallback((newItem, localId) => {
        if (newItem === undefined) {
            setItems(prev => prev.filter((item) => item.localId !== localId))
        } else if (typeof newItem === "function") {
            setItems(prev => prev.map((oldItem) => oldItem.localId === localId ? newItem(oldItem) : oldItem))
        } else {
            setItems(prev => prev.map((oldItem) => oldItem.localId === localId ? newItem : oldItem))
        }

    }, [])

    const addNewItem = useCallback(() => setItems(prev => [...prev, {
        localId: Math.random().toString(36).slice(2),
        name: "",
        quantity: 1,
        unit: "Unit",
        brandName: "",
        ifItemUnavailable: "Unspecified",
        note: ""
    }]), [])


    const iconSx = {"color": "primary.dark", "gridRow": "span 2", "width": "40px", "height": "40px"}

    return <>
        <Typography variant={"h4"} component={"h1"}>Fill your order</Typography>

        <Paper sx={paperSx}>
            <Stack direction={{"sm": "row", "xs": "column"}} shadow={1} spacing={"16px"}
                   justifyContent={"space-around"} backgroundColor={"white"}>

                <Show when={shop?.name}>
                    <Box sx={containerSx}>
                        <ShoppingCartOutlinedIcon sx={iconSx}/>
                        <Typography sx={headerSx}>Chosen
                            shop</Typography>
                        <Typography textAlign={"center"} sx={{"alignSelf": "self-start"}}
                                    alignSelf={"top"}>{shop?.name}</Typography>
                    </Box>

                    <Divider orientation={"vertical"} sx={{"height": "auto"}}/>
                </Show>


                <Box sx={containerSx}>
                    <AccessAlarmsOutlinedIcon sx={iconSx}/>
                    <Typography sx={headerSx}>Delivery time</Typography>
                    <Box sx={containerSx}>
                        <Typography color={"text.light"}>From</Typography>
                        <DateTimePicker
                            onError={(err) => setFromErr(!!err)}
                            maxDateTime={to ? moment(to) : to}
                            name={"order-time-from-input"}
                            value={from ? moment(from) : from}
                            onChange={value => {
                                !isNaN(value) && setFrom(value)
                            }}
                            disablePast
                            sx={dateInputSx}
                            slots={{"actionBar": ((props) => <CustomDateTimePickerActionBar {...props}/>)}}
                            slotProps={{"textField": {variant: "standard"}}}/>

                        <Typography color={"text.light"} justifySelf={"flex-end"}>To</Typography>
                        <DateTimePicker
                            onError={(err) => setToErr(!!err)}
                            minDateTime={from ? moment(from) : from}
                            disablePast
                            value={to ? moment(to) : to}
                            onChange={value => {
                                !isNaN(value) && setTo(value)
                            }}
                            name={"order-time-to-input"}
                            sx={dateInputSx}
                            slots={{"actionBar": ((props) => <CustomDateTimePickerActionBar {...props}/>)}}
                            slotProps={{"textField": {variant: "standard"}}}/>
                    </Box>
                </Box>

                <Divider orientation={"vertical"} sx={{"height": "auto"}}/>

                <Box sx={containerSx}>
                    <SpeakerNotesOutlinedIcon sx={iconSx}/>
                    <Typography sx={headerSx}>Additional notes</Typography>
                    <TextField multiline
                               name={"order-note-input"}
                               sx={dateInputSx}
                               fullwidth={"true"}
                               variant={"standard"}
                               value={notes}
                               onChange={e => setNotes(e.target.value)}
                               InputProps={{
                                   "sx": {
                                       "border": "none", "outline": "none",
                                   }
                               }}/>
                </Box>
            </Stack>
        </Paper>


        <Paper sx={paperSx}>
            <Stack direction={"column"} gap={"32px"}>
                <DarkButton sx={{"alignSelf": "flex-end"}} startIcon={<AddCircleIcon/>} variant={"text"}
                            onClick={addNewItem}>Add
                    Item</DarkButton>

                <form ref={formRef}>
                    <Show when={desktop}
                          fallback={() => <MobileItemTable items={items} setItemsSimple={setItemsSimple}/>}>{() =>
                        <DesktopItemTable items={items} setItemsSimple={setItemsSimple}/>}</Show>
                </form>

                <Stack direction={{"xs": "column-reverse", "sm": "row-reverse"}} gap={"16px"}>

                    <NextButton fromErr={fromErr} toErr={toErr} items={items} onClick={() => {
                        if (formRef.current.reportValidity()) {
                            // Technically, we can skip this validation by just changing the url but
                            // the malicious user will then simply run into backend validation errors.
                            onSubmit(items, from, to, notes)
                        }
                    }}>

                    </NextButton>
                    <OutlinedButton onClick={onGoBack}>Go Back</OutlinedButton>
                </Stack>
            </Stack>
        </Paper>
    </>
}

function NextButton({fromErr, toErr, items, onClick}) {

    const [anchorEl, setAnchorEl] = useState(null);

    const disabled = useMemo(() => fromErr || toErr || items.length === 0, [items, fromErr, toErr])

    return <>
        <Popover sx={{
            pointerEvents: 'none',
        }}
                 open={disabled && !!anchorEl}
                 anchorEl={anchorEl}
                 anchorOrigin={{
                     vertical: 'bottom', horizontal: 'right',
                 }}
                 transformOrigin={{
                     vertical: 'top', horizontal: 'right',
                 }}
                 disableRestoreFocus>

            <Stack gap={"8px"} direction={"row"} sx={{"padding": "16px"}}>
                <ReportIcon sx={{"color": "red"}}/>
                {(fromErr || toErr) ? <Typography>Make sure your delivery dates are
                    valid</Typography> : (items.length === 0 ? <Typography>Please select at least one
                    item</Typography> : undefined)}
            </Stack>
        </Popover>

        <Box
            onMouseEnter={e => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
            sx={{
                "cursor": disabled ? "help" : undefined
            }}
        >
            <DarkButton
                disabled={disabled}
                onClick={onClick}>Next</DarkButton>
        </Box>
    </>
}


const containerSx = {
    "display": "grid",
    "gridTemplateColumns": "min-content auto",
    "justifyContent": "center",
    "alignItems": "center",
    "columnGap": "16px"
}

const dateInputSx = {
    "border": "none", "outline": "none",
}

const headerSx = {
    "textAlign": "center", "alignSelf": "self-end", "color": "text.light"
}

const paperSx = {"borderRadius": "16px", "padding": "32px", "mt": "16px"}
