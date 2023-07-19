import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {InfoPopper} from "../../util/HoverPopper";
import Typography from "@mui/material/Typography";
import {For} from "../../util/ControlFlow";
import {SingleItemView} from "./SingleItemView";
import React from "react";


export function DesktopItemTable({items, setItemsSimple}){
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell itemType={"head"}>Product Name</TableCell>
                <TableCell itemType={"head"}>Quantity</TableCell>
                <TableCell itemType={"head"}>Brand (Optional)</TableCell>
                <TableCell itemType={"head"}>If unavailable</TableCell>
                <TableCell itemType={"head"}
                           sx={{"display": "flex", "alignItems": "center", gap: "8px"}}>Additional
                    notes <InfoPopper><Typography>Here you can specify for example an upper bound
                        on
                        the price or what to do when the item is
                        not available.</Typography></InfoPopper>
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
}