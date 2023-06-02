import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {For} from "../util/ControlFlow";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {formatUnitNumerusClausus} from "../../util/util";


export function OrderItemsOverview({items}) {

    const headerSx = {
        "color": "text.light"
    }

    const cellSx = {
        "padding": "8px 8px 8px 0"
    }

    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}>
            <Typography color={"text.light"} variant={"h6"} component={"h3"}>Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={"head"} sx={{...cellSx, ...headerSx}}>Name</TableCell>
                            <TableCell variant={"head"} sx={{...cellSx, ...headerSx}}>Quantity</TableCell>
                            <TableCell variant={"head"} sx={{...cellSx, ...headerSx}}>Brand</TableCell>
                            <TableCell variant={"head"} sx={{...cellSx, ...headerSx}}>If unavailable</TableCell>
                            <TableCell variant={"head"} sx={{...cellSx, ...headerSx, "width": "50%"}}>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <For each={items}>{item => <TableRow key={item._id}>
                            <TableCell sx={cellSx}>{item.name || ""}</TableCell>
                            <TableCell
                                sx={cellSx}>{item.quantity} {formatUnitNumerusClausus(item.unit, item.quantity)}</TableCell>
                            <TableCell sx={cellSx}>{item.brandName || ""}</TableCell>
                            <TableCell sx={cellSx}>{item.ifItemUnavailable || ""}</TableCell>
                            <TableCell sx={cellSx}>{item.note || ""}</TableCell>
                        </TableRow>}</For>
                    </TableBody>
                </Table>
            </TableContainer>
        </AccordionDetails>
    </Accordion>
}