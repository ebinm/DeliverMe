import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import {SingleBidView} from "./SingleBidView";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React, {useCallback, useRef, useState} from "react";
import {CurrencyInput} from "../util/CurrencyInput";
import {FileUploader} from "react-drag-drop-files";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {RatingModal} from "../util/RatingModal";
import {BaseModal} from "../util/BaseModal"
import {Show} from "../util/ControlFlow"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";

export function SingleOrderViewShopper({order, setOrders}) {

    const [uploadOpen, setUploadOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)

    return <>
        <SingleOrderViewCommon
            showDeliveryAddress
            orderName={`${order?.createdBy?.firstName} ${order?.createdBy?.lastName}`}
            order={order}
            contact={order.createdBy}
            bidView={
                <Accordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography color={"text.light"} variant={"h6"} component={"h3"}>My bid</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {order.selectedBid ? (<SingleBidView bid={order.selectedBid} highlightOnHover={false}/>) : (
                            <Typography>No bid given yet</Typography>)}
                    </AccordionDetails>
                </Accordion>
            }
            buttons={
                <Stack mt={"16px"}>
                    <Show when={order?.status === "In Delivery"}>
                        <DarkButton onClick={() => setUploadOpen(true)}>Upload Receipt</DarkButton>
                    </Show>
                </Stack>

            }
        />
        <ReceiptUploadModal open={uploadOpen} onClose={() => {
            setUploadOpen(false)
        }} onSuccess={() => {
            // setOrders may be undefined for example in the order selection screen.
            setOrders && setOrders(orders => orders.map(it => it !== order ? it : {...it, status: "In Payment"}))
            setUploadOpen(false)
            setRatingOpen(true)
        }}/>
        <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} orderId={order?.id}/>
    </>
}

function ReceiptUploadModal({open, onClose, onSuccess}) {
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState("EUR")

    const [webcamOpen, setWebcamOpen] = useState(false)

    const [img, setImg] = useState(null);
    const webcamRef = useRef();

    const videoConstraints = {
        facingMode: "user",
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
        console.log(imageSrc)
        setWebcamOpen(false)
    }, [webcamRef, setImg]);


    const formRef = useRef()

    const [uploadFeedback, setUploadFeedback] = useState("Upload or drop your receipt here.")

    return <BaseModal open={open} onClose={onClose}>
        <form ref={formRef}>
            <Stack direction={"column"} gap={"16px"} alignItems={"center"}>
                <CurrencyInput label={"Total amount spent"} amount={amount} setAmount={setAmount} currency={currency}
                               setCurrency={setCurrency}/>

                <FileUploader maxSize={32} id={"receipt"}
                              required={true} multiple={false} name="file" types={["JPG", "PNG"]}
                              onTypeError={(err) => setUploadFeedback(err)}
                              onSizeError={(err) => setUploadFeedback(err)}
                              handleChange={(file) => {
                                  const fileReader = new FileReader();
                                  fileReader.onload = (res) => {
                                      setImg(fileReader.result)
                                      setWebcamOpen(false)
                                      console.log(fileReader.result)
                                      setUploadFeedback("Successfully uploaded. (Upload again to replace)")
                                  }
                                  fileReader.readAsDataURL(file)
                              }}
                >
                    <Stack direction={"column"} gap={"16px"} justifyContent={"center"}
                           alignItems={"center"} sx={{
                        "borderWidth": "3px",
                        "borderStyle": "dashed",
                        "borderRadius": "16px",
                        "padding": "16px",
                        "borderColor": "primary.dark"
                    }}>
                        <CloudUploadIcon sx={{"color": "primary.dark", "fontSize": "2rem"}}/>
                        <Typography sx={{"color": "primary.dark"}}> {uploadFeedback}</Typography>
                        <Box component={"img"} src={img} sx={{"maxHeight": "10vh"}}/>
                    </Stack>
                </FileUploader>


                <DarkButton sx={{"width": "100%"}} onClick={() => setWebcamOpen(true)}
                            startIcon={<CameraAltIcon sx={{"fontSize": "2rem"}}/>}>
                    ...or just take a photo
                </DarkButton>

                <Show when={webcamOpen}>
                    <Webcam
                        audio={false}
                        mirrored={true}
                        height={400}
                        width={400}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                    />
                    <DarkButton sx={{"width": "100%"}} onClick={() => capture()}
                                startIcon={<CameraAltIcon sx={{"fontSize": "2rem"}}/>}>
                        Take photo
                    </DarkButton>
                </Show>


            </Stack>
        </form>

        <Stack direction={"row-reverse"} gap={"8px"} mt={"16px"}>
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