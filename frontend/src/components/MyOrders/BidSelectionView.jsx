import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {For} from "../util/ControlFlow"
import {SingleBidView} from "./SingleBidView";

export function BidSelectionView({bids, selected, setSelected}) {

    return <Accordion defaultExpanded={true}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}>
            <Typography color={"text.light"} variant={"h6"} component={"h3"}>Bids</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box display={"flex"} flexDirection={"column"}>
                <For each={bids} fallback={<Typography color={"text.light"}>No bids received</Typography>}>{bid =>
                    <SingleBidView key={bid._id} bid={bid} selected={selected} setSelected={setSelected}/>
                }</For>
            </Box>
        </AccordionDetails>
    </Accordion>
}

