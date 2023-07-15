import React, {useCallback, useEffect, useRef, useState} from "react";
import {Box, Stack, Typography} from "@mui/material";
import {BaseModal} from "../util/BaseModal"
import {detectCost} from "../../util/ocr";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {Show} from "../util/ControlFlow";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {CurrencyInput} from "../util/CurrencyInput";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";
import CameraIcon from '@mui/icons-material/Camera';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import CircularProgress from '@mui/material/CircularProgress';
import {useSnackbar} from "notistack";
import {CustomFileInput} from "../util/CustomFileUpload";


const ReceiptUploadModal = ({orderId, open, onClose, onSuccess}) => {
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState("EUR")

    const [uploadLoading, setUploadLoadingUploadLoading] = useState(false)
    const [loadingOCR, setLoadingOCR] = useState(false)

    const modifiedAmount = useRef(false)
    const [error, setError] = useState(undefined)

    const [webcamOpen, setWebcamOpen] = useState(false)

    const [img, setImg] = useState(null);
    const webcamRef = useRef();

    const videoConstraints = {
        facingMode: "user",
    };

    const {enqueueSnackbar} = useSnackbar();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
        console.log(imageSrc)
        setWebcamOpen(false)
    }, [webcamRef, setImg]);

    useEffect(() => {
        modifiedAmount.current = true
        setLoadingOCR(false)
    }, [amount, modifiedAmount])


    useEffect(() => {
        // I think this useEffect leaks memory...:/
        modifiedAmount.current = false
        if (!img) {
            return
        }

        setLoadingOCR(true)
        detectCost(img).then(cost => {
            // make sure we do not just overwrite someone's changes.
            if (!modifiedAmount.current) {
                if (cost !== undefined) {
                    setAmount(cost)
                    enqueueSnackbar("Automatically extracted cost. Please verify.", {variant: "success"})
                }else{
                    enqueueSnackbar("Could not detect cost from receipt. Please enter manually.", {variant: "error"})
                }
            }
            setLoadingOCR(false)
        })
    }, [img])


    return (
        <BaseModal open={open} onClose={onClose} title={"Upload your Receipt"}>
            <>
                <Show when={!uploadLoading} fallback={<CircularProgress alignSelf={"center"} sx={{"color": "primary.dark"}}/>}>{() =>
                    <>
                        <Show when={!webcamOpen}>

                            <CurrencyInput label={"Total amount spent"} amount={amount} setAmount={setAmount}
                                           currency={currency}
                                           setCurrency={setCurrency}
                                           sx={{mb: 2}}
                                           required
                            />

                            <Show when={loadingOCR}>
                                {/*Loading animation inspired by https://stackoverflow.com/a/67605934*/}
                                {/*Yes, I am indeed just guessing the width of the font instead of using a monospace font*/}
                                <Box alignSelf={"center"}><Typography component={"strong"} sx={{
                                    "display": "inline-block",
                                    "animation": "dots 1s steps(4) infinite",
                                    "clipPath": "inset(0 0.8em 0 0)",
                                    "@keyframes dots": {
                                        "to": {
                                            "clipPath": "inset(0 -0.2em 0 0)"
                                        }
                                    }
                                }}>Trying to detect
                                    cost...</Typography></Box>
                            </Show>


                            <CustomFileInput defaultLabel={"Upload or drop your receipt here and let us try and extract the cost."} img={img}
                                             setImg={setImg}/>

                            <DarkButton sx={{mb: 2, "width": "100%"}} onClick={() => setWebcamOpen(true)}
                                        startIcon={<CameraAltIcon sx={{"fontSize": "2rem"}}/>}>
                                ...or just take a photo
                            </DarkButton>
                        </Show>


                        <Show when={webcamOpen} gap={"16px"}>
                            <Box alignSelf={"center"}>
                                <Webcam
                                    audio={false}
                                    mirrored={true}
                                    width={"100%"}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                />
                            </Box>

                            <Stack
                                direction={"row"}
                                flexWrap={"wrap"}
                                sx={{mt: 2, justifyContent: 'center'}}
                                width={"100%"}
                                gap={"16px"}
                                // divider={<Divider orientation="vertical" flexItem/>}
                                // spacing={{xs: 1, sm: 1, md: 1}}
                            >
                                <DarkButton sx={{"flex": 1}} onClick={() => capture()}
                                            startIcon={<CameraIcon sx={{"fontSize": "2rem"}}/>}>
                                    Take photo
                                </DarkButton>

                                <DarkButton sx={{"flex": 1}} onClick={() => setWebcamOpen(false)}
                                            startIcon={<NoPhotographyIcon sx={{"fontSize": "2rem"}}/>}>
                                    Close Camera
                                </DarkButton>
                            </Stack>

                        </Show>
                    </>
                }</Show>

                <Show when={error}>
                    <Box alignSelf={"center"}><strong>{error}</strong></Box>
                </Show>

                <Stack direction={"row"} justifyContent={"flex-end"} gap={"8px"} mt={"16px"}>
                    <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>

                    <DarkButton onClick={async () => {
                        if (amount > 0 && img) {
                            setUploadLoadingUploadLoading(true)

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
                                setError(JSON.stringify((await res.json()).msg));
                            }
                            setUploadLoadingUploadLoading(false)
                        } else {
                            enqueueSnackbar('Please enter the cost & upload the bill', {variant: 'error'});

                        }
                    }}>Upload</DarkButton>
                </Stack>

            </>
        </BaseModal>
    );
};

export default ReceiptUploadModal;