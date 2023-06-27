import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import {SingleBidView} from "./SingleBidView";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React, {useCallback, useContext, useRef, useState} from "react";
import {CurrencyInput} from "../util/CurrencyInput";
import {FileUploader} from "react-drag-drop-files";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {RatingModal} from "../util/RatingModal";
import {BaseModal} from "../util/BaseModal"
import {For, Show} from "../util/ControlFlow"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";
import CameraIcon from '@mui/icons-material/Camera';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import {CustomerContext} from "../../util/context/CustomerContext";
import {PUT_FETCH_OPTIONS} from "../../util/util";

export function SingleOrderViewShopper({order, setOrders}) {

    const {customer} = useContext(CustomerContext)

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
                        <Typography color={"text.light"} variant={"h6"} component={"h3"}>My bid{order.selectedBid ? " (selected)" : ""}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Show when={order.selectedBid} fallback={
                            <For each={order.bids}
                                 fallback={<Typography color={"text.light"}>No bids placed</Typography>}>{bid =>
                                <SingleBidView key={bid._id} bid={bid} highlightOnHover={false}/>
                            }</For>
                        }>{bid =>
                            <SingleBidView bid={bid} highlightOnHover={false}/>
                        }</Show>
                    </AccordionDetails>
                </Accordion>
            }
            buttons={
                <Stack mt={"16px"}>
                    <Show when={order?.status === "In Delivery" && order?.selectedBid?.createdBy._id === customer._id}>
                        <DarkButton onClick={() => setUploadOpen(true)}>Upload Receipt</DarkButton>
                    </Show>
                </Stack>

            }
        />
        <ReceiptUploadModal orderId={order?._id} open={uploadOpen} onClose={() => {
            setUploadOpen(false)
        }} onSuccess={() => {
            // setOrders may be undefined for example in the order selection screen.
            setOrders && setOrders(orders => orders.map(it => it !== order ? it : {...it, status: "In Payment"}))
            setUploadOpen(false)
            setRatingOpen(true)
        }}/>
        <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} order={order}/>
    </>
}

function ReceiptUploadModal({orderId, open, onClose, onSuccess}) {
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

    return <BaseModal open={open} onClose={onClose} sx={{"maxHeight": "80vh", "overflowY": "auto"}}>
        <form ref={formRef}>
            <Stack direction={"column"} gap={"16px"} alignItems={"center"} padding={"8px 0"}>
                <CurrencyInput label={"Total amount spent"} amount={amount} setAmount={setAmount} currency={currency}
                               setCurrency={setCurrency}/>

                <FileUploader maxSize={32} id={"receipt"}
                              required={!img} multiple={false} name="file" types={["JPG", "PNG"]}
                              onTypeError={(err) => setUploadFeedback(err)}
                              onSizeError={(err) => setUploadFeedback(err)}
                              handleChange={(file) => {
                                  const fileReader = new FileReader();
                                  fileReader.onload = () => {
                                      setImg(fileReader.result)
                                      setWebcamOpen(false)
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
                                startIcon={<CameraIcon sx={{"fontSize": "2rem"}}/>}>
                        Take photo
                    </DarkButton>
                    <DarkButton sx={{"width": "100%"}} onClick={() => setWebcamOpen(false)}
                                startIcon={<NoPhotographyIcon sx={{"fontSize": "2rem"}}/>}>
                        Close Camera
                    </DarkButton>
                </Show>
            </Stack>
        </form>

        <Stack direction={"row-reverse"} gap={"8px"} mt={"16px"}>
            <DarkButton onClick={async () => {
                if (formRef.current?.reportValidity()) {
                    // TODO extract common fetch options
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${orderId}/receipt`, {
                        ...PUT_FETCH_OPTIONS,
                        body: JSON.stringify({
                            "image": img,
                            "costAmount": amount,
                            "costCurrency": currency
                        })
                    })

                    if (res.ok) {
                        onSuccess()
                    } else {
                        // TODO panic
                    }
                }
            }}>Upload</DarkButton>
            <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
        </Stack>
    </BaseModal>
}