import {Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import {BidSelectionView} from "./BidSelectionView";
import {useState} from "react";
import {SingleBidView} from "./SingleBidView";
import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {BaseModal} from "../util/BaseModal";

export function SingleOrderViewBuyer({order, orderName}) {

    const [selectedBid, setSelectedBid] = useState()
    const [confirmOrderModalOpen, setConfirmOrderModalOpen] = useState(false)

    const buttonStyle = { //TODO: use theme
        "backgroundColor": "primary.dark",
        "&:hover": {
            color: "text.main",
            borderColor: "text.main"
        }
    }

    return <>
        <BaseModal open={confirmOrderModalOpen} onClose={() => setConfirmOrderModalOpen(false)}>
            {/*TODO "Jetzt kostenpflichtig betsellen"*/}
            <Typography sx={{"margin": "8px"}}>Are you sure you want to accept this bid? This cannot be
                undone.</Typography>
            <ButtonGroup>
                <Button onClick={() => {
                    setConfirmOrderModalOpen(false)
                }} sx={{...buttonStyle, flexGrow: 1}}>Cancel</Button>
                <Button onClick={() => {
                    // TODO Set selected order
                    console.warn("TODO set selected order")
                    setConfirmOrderModalOpen(false)
                }} sx={{...buttonStyle, flexGrow: 1}}>Confirm</Button>
            </ButtonGroup>
        </BaseModal>

        <SingleOrderViewCommon
            orderName={orderName}
            order={order} contact={order.selectedBid?.createdBy}
            buttons={<ButtonGroup sx={{"justifyContent": "end"}}>
                <Show when={selectedBid !== undefined}>
                    <Button onClick={() => {
                        setConfirmOrderModalOpen(true)
                    }} sx={buttonStyle}>Select Bid</Button>
                </Show>
            </ButtonGroup>}

            bidView={
                <Show when={order.selectedBid}
                      fallback={<BidSelectionView bids={order.bids} selected={selectedBid}
                                                  setSelected={setSelectedBid}/>}>{selectedBid =>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography color={"text.light"} variant={"h6"} component={"h3"}>Selected bid</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SingleBidView bid={selectedBid} highlightOnHover={false}/>
                        </AccordionDetails>
                    </Accordion>
                }
                </Show>
            }
        />
    </>
}


