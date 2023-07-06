import Typography from "@mui/material/Typography";
import {Box, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Divider from "@mui/material/Divider";
import {For, Show} from "../../util/ControlFlow";
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import {DateTimePicker} from "@mui/x-date-pickers";
import {memo, useCallback, useRef} from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import {formatUnitNumerusClausus} from "../../../util/util";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {DarkButton, OutlinedButton} from "../../util/Buttons";
import {CustomDateTimePickerActionBar} from "../../util/CustomDateTimePickerActionBar";
import moment from "moment";
import {InfoPopover} from "../../util/InfoPopover";


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

    const setItemsSimple = useCallback(
        (newItem, localId) => {
            if (newItem === undefined) {
                setItems(prev => prev.filter((item) => item.localId !== localId))
            } else if (typeof newItem === "function") {
                setItems(prev => prev.map((oldItem) => oldItem.localId === localId ? newItem(oldItem) : oldItem))
            } else {
                setItems(prev => prev.map((oldItem) => oldItem.localId === localId ? newItem : oldItem))
            }

        }, [])

    const addNewItem = useCallback(
        () => setItems(prev => [...prev, {
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
            <Stack direction={"row"} shadow={1}
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
                            name={"order-time-from-input"}
                            value={from ? moment(from) : from}
                            onChange={value => !isNaN(value) && setFrom(value)}
                            disablePast
                            sx={dateInputSx}
                            slots={{"actionBar": ((props) => <CustomDateTimePickerActionBar {...props}/>)}}
                            slotProps={{"textField": {variant: "standard"}}}/>

                        <Typography color={"text.light"} justifySelf={"flex-end"}>To</Typography>
                        <DateTimePicker
                            disablePast
                            value={to ? moment(to) : to}
                            onChange={value => !isNaN(value) && setTo(value)}
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
                                       "border": "none",
                                       "outline": "none",
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell itemType={"head"}>Product Name</TableCell>
                                <TableCell itemType={"head"}>Quantity</TableCell>
                                <TableCell itemType={"head"}>Brand (Optional)</TableCell>
                                <TableCell itemType={"head"}>If unavailable</TableCell>
                                <TableCell itemType={"head"}
                                           sx={{"display": "flex", "alignItems": "center", gap: "8px"}}>Additional
                                    notes <InfoPopover><Typography>Here you can specify for example an upper bound on
                                        the price or what to do when the item is
                                        not available.</Typography></InfoPopover>
                                </TableCell>
                                <TableCell itemType={"head"}/>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <For each={items}>{(item) =>
                                <SingleItemView key={item.localId} item={item} setSelf={setItemsSimple}/>
                            }</For>
                        </TableBody>
                    </Table>
                </form>

                <Stack direction={"row-reverse"} gap={"16px"}>
                    <DarkButton onClick={() => {
                        if (formRef.current.reportValidity()) {
                            onSubmit(items, from, to, notes)
                        }
                    }}>Next</DarkButton>
                    <OutlinedButton onClick={onGoBack}>Go Back</OutlinedButton>
                </Stack>
            </Stack>
        </Paper>
    </>
}


const SingleItemView = memo(({item, setSelf}) => {

    return <TableRow>
        <TableCell>
            <TextField value={item.name} name={"grocery-item-name-input"}
                       required
                       variant={"standard"}
                       onChange={(e) => {
                           // e is a synthetic event which might change value between now and when the callback
                           // of setSelf is called
                           const value = e.target.value
                           setSelf(prev => ({...prev, name: value}), item.localId)
                       }}/>
        </TableCell>

        <TableCell>
            <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
                <TextField value={item.quantity} type={"number"} inputProps={{"min": "1"}}
                           name={"grocery-item-quantity-input"}
                           variant={"standard"}
                           onChange={(e) => {
                               const value = e.target.value
                               setSelf(prev => ({...prev, quantity: parseInt(value)}), item.localId)
                           }}/>

                <Select value={item.unit}
                        name={"grocery-item-unit-input"}
                        variant={"standard"}
                        onChange={e => {
                            const value = e.target.value
                            setSelf(prev => ({...prev, unit: value}), item.localId)
                        }
                        }>
                    <MenuItem value={"Unit"}>{formatUnitNumerusClausus("Unit", item.quantity)}</MenuItem>
                    <MenuItem value={"kg"}>kg</MenuItem>
                    <MenuItem value={"lb"}>lb</MenuItem>
                </Select>
            </Stack>
        </TableCell>

        <TableCell>
            <TextField value={item.brandName}
                       variant={"standard"}
                       name={"grocery-item-brand-name-input"}
                       onChange={(e) => {
                           const value = e.target.value
                           setSelf(prev => ({...prev, brandName: value}), item.localId)
                       }}/>
        </TableCell>

        <TableCell>
            <Select value={item.ifItemUnavailable}
                    variant={"standard"}
                    name={"grocery-item-if-item-unavailable-input"}
                    onChange={e => {
                        const value = e.target.value
                        setSelf(prev => ({...prev, ifItemUnavailable: value}), item.localId)
                    }}>
                <MenuItem value={"Unspecified"}>Unspecified</MenuItem>
                <MenuItem value={"Buy Nothing"}>Buy Nothing</MenuItem>
                <MenuItem value={"Ignore Brand"}>Ignore Brand</MenuItem>
                <MenuItem value={"See Notes"}>See Notes</MenuItem>
            </Select>
        </TableCell>

        <TableCell>
            <TextField value={item.note} name={"grocery-item-note-input"}
                       variant={"standard"}
                       multiline
                       onChange={(e) => setSelf(prev => ({...prev, note: e.currentTarget?.value}), item.localId)}/>
        </TableCell>

        <TableCell>
            <Button onClick={() => setSelf(undefined, item.localId)}>
                <RemoveCircleIcon sx={{"color": "primary.dark"}}/>
            </Button>
        </TableCell>
    </TableRow>
})


const containerSx = {
    "display": "grid",
    "gridTemplateColumns": "min-content auto",
    "justifyContent": "center",
    "alignItems": "center",
    "columnGap": "16px"
}

const dateInputSx = {
    "border": "none",
    "outline": "none",
}

const headerSx = {
    "textAlign": "center",
    "alignSelf": "self-end",
    "color": "text.light"
}

const paperSx = {"borderRadius": "16px", "padding": "32px", "mt": "16px"}
