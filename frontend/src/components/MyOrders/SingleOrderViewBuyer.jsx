import {Accordion, AccordionDetails, AccordionSummary, ButtonGroup, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import {BidSelectionView} from "./BidSelectionView";
import {useState} from "react";
import {SingleBidView} from "./SingleBidView";
import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {BaseModal} from "../util/BaseModal";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {useSnackbar} from "notistack";

export function SingleOrderViewBuyer({order, orderName, setOrders, deleteSelf}) {

    const [selectedBid, setSelectedBid] = useState()
    const [confirmOrderModalOpen, setConfirmOrderModalOpen] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    return <>
        <BaseModal open={confirmOrderModalOpen} onClose={() => setConfirmOrderModalOpen(false)} title={"Warning"}>
            {/*TODO "Jetzt kostenpflichtig betsellen"*/}
            <Typography align="center" sx={{"margin": "8px"}}>Are you sure you want to accept this bid? This cannot be
                undone.</Typography>
            <Stack direction={{"xs": "column-reverse", "sm": "row-reverse"}} gap={"8px"} sx={{"mt": "32px"}}>
                <DarkButton sx={{"flexGrow": "1"}} onClick={async () => {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/selectBid`, {
                        ...PUT_FETCH_OPTIONS,
                        body: JSON.stringify({
                            bidId: selectedBid
                        })
                    })


                    if (res.ok) {
                        setSelectedBid(undefined)
                        // We should probably just refetch instead of doing these client side updates
                        setOrders(orders =>
                            orders.map(it => it !== order ? it : {
                                ...it,
                                status: "In Delivery",
                                selectedBid: it.bids.find(b => b._id === selectedBid)
                            })
                        )
                        enqueueSnackbar("Successfully selected bid", {"variant": "success"})
                        setConfirmOrderModalOpen(false)
                    } else {
                        // TODO error handling
                        enqueueSnackbar("Failed to select bid. Please try again later.", {"variant": "error"})
                    }

                }}>Confirm</DarkButton>
                <OutlinedButton sx={{"flexGrow": "1"}} onClick={() => {
                    setConfirmOrderModalOpen(false)
                }}>Cancel</OutlinedButton>
            </Stack>
        </BaseModal>

        <SingleOrderViewCommon
            deleteSelf={deleteSelf}
            orderName={orderName}
            order={order} contact={order.selectedBid?.createdBy}
            buttons={<ButtonGroup sx={{"justifyContent": "end"}}>
                <Show when={selectedBid !== undefined}>
                    <DarkButton onClick={() => {
                        setConfirmOrderModalOpen(true)
                    }}>Select Bid</DarkButton>
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


