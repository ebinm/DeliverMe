import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import {SingleBidView} from "./SingleBidView";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function SingleOrderViewShopper({order, orderName}) {

    return <SingleOrderViewCommon
        orderName={orderName}
        order={order}
        contact={order.createdBy}
        bidView={
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography color={"text.light"} variant={"h6"} component={"h3"}>My bid</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SingleBidView bid={order.selectedBid} highlightOnHover={false}/>
                </AccordionDetails>
            </Accordion>
        }
    />
}