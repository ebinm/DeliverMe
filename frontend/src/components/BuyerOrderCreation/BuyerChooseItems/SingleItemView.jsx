import {memo} from "react";
import {MenuItem, Select, TableCell, TableRow} from "@mui/material";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import {formatUnitNumerusClausus} from "../../../util/util";
import Button from "@mui/material/Button";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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

export {
    SingleItemView
}