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
import {For, Show} from "../util/ControlFlow";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {formatUnitNumerusClausus} from "../../util/util";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import {BaseModal} from "../util/BaseModal";
import {useState} from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import {DarkButton} from "../util/Buttons";


export function OrderItemsOverview({items, defaultExpanded, title = "Overview"}) {


    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("sm"))


    return <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}>
            <Typography color={"text.light"} variant={"h6"} component={"h3"}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Show when={desktop} fallback={() => <MobileOrderItemsOverview items={items}/>}>
                <DesktopOrderItemsOverview items={items}/>
            </Show>
        </AccordionDetails>
    </Accordion>
}


function MobileOrderItemsOverview({items}) {
    const [selectedItem, setSelectedItem] = useState(undefined)

    return <Stack direction={"column"} gap={"8px"}>
        <For each={items} fallback={<Typography color={"text.light"}>No items selected</Typography>}>{item =>
            <Paper key={item._id || item.localId} sx={{"curser": "pointer", "padding": "8px"}} onClick={() => setSelectedItem(item)}>
                <Stack direction={"column"}>
                    <Typography>{item.quantity} {formatUnitNumerusClausus(item.unit, item.quantity)} of {item.name}...</Typography>
                </Stack>
            </Paper>
        }</For>

        <BaseModal open={!!selectedItem} onClose={() => setSelectedItem(undefined)}>
            <MobileOrderItemsOverviewModalContent item={selectedItem} onClose={() => setSelectedItem(undefined)}/>
        </BaseModal>
    </Stack>
}

function MobileOrderItemsOverviewModalContent({item, onClose}) {
    return <Stack>
        <Typography sx={{"color": "text.light"}}>Name</Typography>
        <Typography>{item.name}</Typography>

        <Divider sx={{"m": "8px 0"}}/>

        <Typography sx={{"color": "text.light"}}>Quantity</Typography>
        <Typography>{item.quantity} {formatUnitNumerusClausus(item.unit, item.quantity)}</Typography>

        <Divider sx={{"m": "8px 0"}}/>

        <Typography sx={{"color": "text.light"}}>Brand Name</Typography>
        <Typography>{item.brandName}</Typography>

        <Divider sx={{"m": "8px 0"}}/>

        <Typography sx={{"color": "text.light"}}>If Unavailable</Typography>
        <Typography>{item.ifItemUnavailable}</Typography>

        <Divider sx={{"m": "8px 0"}}/>

        <Typography sx={{"color": "text.light"}}>Additional Notes</Typography>
        <Typography>{item.notes}</Typography>

        <DarkButton onClick={onClose} sx={{"alignSelf": "end", "mt": "24px"}}>
            Close
        </DarkButton>
    </Stack>
}

function DesktopOrderItemsOverview({items}) {
    const headerSx = {
        "color": "text.light"
    }

    const cellSx = {
        "padding": "8px 8px 8px 0"
    }


    return <TableContainer>
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
                <For each={items}>{item => <TableRow key={item._id || item.localId}>
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
}