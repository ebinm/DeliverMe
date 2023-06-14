import { SingleOrderViewCommon } from "./SingleOrderViewCommon";
import { SingleBidView } from "./SingleBidView";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import Stack from "@mui/material/Stack";
import React, {useRef, useState} from "react";
import {CurrencyInput} from "../util/CurrencyInput";
import {FileUploader} from "react-drag-drop-files";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {RatingModal} from "../util/RatingModal";
import {BaseModal} from "../util/BaseModal"
import {Show} from "../util/ControlFlow"

export function SingleOrderViewShopper({ order, orderName }) {

    const [uploadOpen, setUploadOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)

    return <>
        <SingleOrderViewCommon
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
            buttons={
                <Stack mt={"16px"}>
                    <Show when={order?.status === "In Progress"}>
                        <DarkButton onClick={() => setUploadOpen(true)}>Upload Receipt</DarkButton>
                    </Show>
                </Stack>

            }
        />
        <ReceiptUploadModal open={uploadOpen} onClose={() => {
            setUploadOpen(false)
        }} onSuccess={() => {
            setUploadOpen(false)
            setRatingOpen(true)
        }}/>
        <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} orderId={order?.id}/>
    </>
}

function ReceiptUploadModal({open, onClose, onSuccess}) {
    const [amount, setAmount] = useState(0)
    const formRef = useRef()

    const [uploadFeedback, setUploadFeedback] = useState("Upload or drop your receipt here.")

    return <BaseModal open={open} onClose={onClose}>
        <form ref={formRef}>
            <Stack direction={"column"} gap={"16px"} alignItems={"center"}>
                <CurrencyInput amount={amount} setAmount={setAmount}/>

                <FileUploader maxSize={32} id={"receipt"}
                              required={true} multiple={false} name="file" types={["JPG", "PNG"]}
                              onTypeError={(err) => setUploadFeedback(err)}
                              onSizeError={(err) => setUploadFeedback(err)}
                              handleChange={() => setUploadFeedback("Successfully uploaded. (Upload again to replace)")}
                >
                    <Stack direction={"column"} gap={"16px"} height={"20vh"} justifyContent={"center"}
                           alignItems={"center"} sx={{
                        "borderWidth": "3px",
                        "borderStyle": "dashed",
                        "borderRadius": "16px",
                        "padding": "16px",
                        "borderColor": "primary.dark"
                    }}>
                        <CloudUploadIcon sx={{"color": "primary.dark", "fontSize": "2rem"}}/>
                        <Typography sx={{"color": "primary.dark"}}> {uploadFeedback}</Typography>
                    </Stack>
                </FileUploader>

            </Stack>
        </form>

        <Stack direction={"row-reverse"} mt={"16px"} gap={"8px"}>
            <DarkButton onClick={() => {
                if (formRef.current?.reportValidity()) {
                    // TODO upload stuff and check
                    onSuccess()
                }
            }}>Upload</DarkButton>
            <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
        </Stack>
    </BaseModal>
}