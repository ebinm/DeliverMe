import {For} from "../../util/ControlFlow";
import {BaseModal} from "../../util/BaseModal";
import React, {useState} from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {formatUnitNumerusClausus} from "../../../util/util";
import {DarkButton} from "../../util/Buttons";
import {InfoPopper} from "../../util/HoverPopper";

export function MobileItemTable({items, setItemsSimple}) {

    const [editedItem, setEditedItem] = useState(undefined)


    return <>
        <Stack direction={"column"} gap={"16px"}>

            <For each={items}>{item => <Paper sx={{"cursor": "pointer", "padding": "8px"}}
                                              onClick={() => setEditedItem(item)}
                                              key={item.localId}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <TextField required={true} value={item.name}
                               sx={{"maxWidth": "0", "padding": "0", "opacity": "0", "display": "hidden"}}/>
                    <Typography sx={{"color": "text.dark"}}>{item.name || "Unspecified"}</Typography>

                    <Button onClick={(e) => {
                        e.stopPropagation()
                        setItemsSimple(undefined, item.localId)
                    }}>
                        <RemoveCircleIcon sx={{"color": "primary.dark"}}/>
                    </Button>
                </Stack>
            </Paper>}</For>

        </Stack>

        <BaseModal sx={{"overflow": "auto"}} open={!!editedItem} onClose={() => {
            setItemsSimple(editedItem, editedItem.localId)
            setEditedItem(undefined)
        }}>
            <ModalEditContent item={editedItem} setSelf={setEditedItem} onClose={() => {
                setItemsSimple(editedItem, editedItem.localId)
                setEditedItem(undefined)
            }}/>
        </BaseModal>
    </>
}


function ModalEditContent({item, setSelf, onClose}) {
    return <Stack gap={"16px"} overflow={"auto"} sx={{"maxWidth": "100%", "maxHeight": "100%"}} padding={"8px 0"}>

        <TextField value={item.name} name={"grocery-item-name-input"}
                   required
                   label={"Name"}
                   onChange={(e) => {
                       // e is a synthetic event which might change value between now and when the callback
                       // of setSelf is called
                       const value = e.target.value
                       setSelf(prev => ({...prev, name: value}), item.localId)
                   }}/>

        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
            <TextField value={item.quantity} type={"number"} inputProps={{"min": "1"}}
                       label={"Quantity"}
                       name={"grocery-item-quantity-input"}
                       onChange={(e) => {
                           const value = e.target.value
                           setSelf(prev => ({...prev, quantity: parseInt(value)}), item.localId)
                       }}/>

            <Select value={item.unit}
                    label={"Unit"}
                    name={"grocery-item-unit-input"}
                    onChange={e => {
                        const value = e.target.value
                        setSelf(prev => ({...prev, unit: value}), item.localId)
                    }}>
                <MenuItem value={"Unit"}>{formatUnitNumerusClausus("Unit", item.quantity)}</MenuItem>
                <MenuItem value={"kg"}>kg</MenuItem>
                <MenuItem value={"lb"}>lb</MenuItem>
            </Select>
        </Stack>

        <TextField value={item.brandName}
                   name={"grocery-item-brand-name-input"}
                   label={"Brand Name"}
                   onChange={(e) => {
                       const value = e.target.value
                       setSelf(prev => ({...prev, brandName: value}), item.localId)
                   }}/>


        <FormControl>
            <InputLabel shrink={true}>If unavailable</InputLabel>
            <Select value={item.ifItemUnavailable}
                    label={"If unavailable"}
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
        </FormControl>

        <TextField value={item.note} name={"grocery-item-note-input"}
                   label={"Additional Notes"}
                   multiline
                   onChange={(e) => setSelf(prev => ({...prev, note: e.currentTarget?.value}), item.localId)}
                   InputProps={{
                       endAdornment:
                           <InfoPopper><Typography>Here you can specify for example an upper bound
                               on
                               the price or what to do when the item is
                               not available.</Typography></InfoPopper>

                   }}
        />
        <DarkButton sx={{"alignSelf": "end"}} onClick={onClose}>Close</DarkButton>
    </Stack>
}