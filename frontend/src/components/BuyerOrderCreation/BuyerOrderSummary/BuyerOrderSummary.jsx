import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    FormGroup,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { OrderItemsOverview } from "../../MyOrders/OrderItemsOverview";
import { createSearchParams, Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CustomerContext } from "../../../util/context/CustomerContext";
import { useCacheLocalStorageForCustomer } from "../../../util/hooks";
import Stack from "@mui/material/Stack";
import { DarkButton, OutlinedButton } from "../../util/Buttons";
import { Show } from "../../util/ControlFlow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateDisplay } from "../../MyOrders/DateDisplay";
import { BaseModal } from "../../util/BaseModal";
import { useJsApiLoader } from '@react-google-maps/api';
import {useSnackbar} from 'notistack';

export function BuyerOrderSummary({
    items,
    to, from, notes,
    shop,
    onGoBack, onSubmit
}) {

    const { customer, ready } = useContext(CustomerContext)
    const location = useLocation()

    const [shippingAddressName, setShippingAddressName] = useCacheLocalStorageForCustomer("address-name-cache", "")
    const [shippingAddressStreetAndNumber, setShippingAddressStreetAndNumber] = useCacheLocalStorageForCustomer("address-street-cache", "")
    const [shippingAddressZipCode, setShippingAddressZipCode] = useCacheLocalStorageForCustomer("address-zip-code-cache", "")
    const [shippingAddressCity, setShippingAddressCity] = useCacheLocalStorageForCustomer("address-city-cache", "")

    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [shippingOpen, setShippingOpen] = useState(true)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const {enqueueSnackbar} = useSnackbar();

    // We use useState as a way of handling a constant here to stop useJsApiLoader from triggering more than once.
    const [googleLibraries] = useState(["places"]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCAiDt2WyuMhekA25EMEQgx_wVO_WQW8Ok",
        libraries: googleLibraries
    });

    const getAddressLocation = async (address) => {

        if (isLoaded) {
            console.log("Getting location for address: ", address);
            return new Promise((resolve, reject) => {
                const geocoder = new window.google.maps.Geocoder();

                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK') {
                        if (results.length > 0) {
                            console.log('Found location for address: ', results[0]);
                            resolve(results[0]);
                        } else {
                            console.log('No location found');
                            resolve(null);
                        }
                    } else {
                        console.log('Could not find location for this address, reason:', status);
                        resolve(null);
                    }
                });
            });
        }
    };




    useEffect(() => {
        // Used to set the default value as soon as the customer is available. The default value prop cannot be used
        // with controlled input apparently
        if (customer?._id) {
            setShippingAddressName(`${customer.firstName} ${customer.lastName}`)
        }
    }, [customer?._id])

    const formRef = useRef()

    if (!ready) {
        return <CircularProgress sx={{ color: "primary.dark" }} />
    }

    if (!customer) {
        return <Navigate to={{
            pathname: "/buyer/signup",
            search: createSearchParams({
                "ref": location.pathname
            }).toString()
        }} />
    }

    return <Paper sx={{ "borderRadius": "16px" }}>
        <Typography component={"h2"} variant={"h5"}
            sx={{ "alignSelf": "center", "padding": "16px" }}>Checkout</Typography>

        <OrderItemsOverview items={items} defaultExpanded={false} title={"Items"} />


        <Accordion expanded={shippingOpen} onChange={(ignored, b) => setShippingOpen(b)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color={"text.light"} variant={"h6"} component={"h3"}>Shipping</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <form ref={formRef} onSubmit={e => e.preventDefault()}>
                    <FormGroup>
                        <Stack direction={"column"} gap={"16px"}>
                            <TextField label={"Full name"} required
                                onChange={e => setShippingAddressName(e.target.value)}
                                value={shippingAddressName} />
                            <TextField label={"Street name and house number"} required
                                onChange={e => setShippingAddressStreetAndNumber(e.target.value)}
                                value={shippingAddressStreetAndNumber} />

                            <TextField label={"Zip code"} required
                                onChange={e => setShippingAddressZipCode(e.target.value)}
                                value={shippingAddressZipCode} />

                            <TextField label={"City"} required
                                onChange={e => setShippingAddressCity(e.target.value)}
                                value={shippingAddressCity} />
                        </Stack>
                    </FormGroup>
                </form>

                <Show when={to || from || notes}>
                    <Stack padding={"32px 0"}>
                        <Typography color={"text.light"} variant={"h6"} component={"h3"}>Extras</Typography>
                        <DateDisplay from={from} to={to} />
                        <Show when={notes}>
                            <Typography>Additional Notes: {notes}</Typography>
                        </Show>
                    </Stack>
                </Show>
            </AccordionDetails>
        </Accordion>

        <Stack direction={"row-reverse"} gap={"16px"} padding={"16px"}>
            <DarkButton onClick={() => {
                if (formRef.current.reportValidity()) {
                    setConfirmModalOpen(true)
                } else {
                    // ngl this is a bit sketchy, but we want to show the user their mistakes
                    // in the shipping section which we can only do if it is open.
                    setShippingOpen(true)
                    setTimeout(() => {
                        formRef.current.reportValidity()
                    })
                }
            }}>Place order</DarkButton>
            <OutlinedButton onClick={onGoBack}>Go Back</OutlinedButton>
        </Stack>

        <BaseModal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} title={"Warning"}>
           
            <Typography align="center" sx={{ "padding": "16px" }}>Are you sure you want to place the order?</Typography>

            <Stack direction={"row-reverse"} justifyContent={"space-between"} gap={"16px"} >

                <DarkButton sx={{ "flexGrow": "1" }} onClick={async () => {

                    setLoading(true)

                    const destination = await getAddressLocation(shippingAddressStreetAndNumber + ", " + shippingAddressZipCode + ", " + shippingAddressCity);
                    console.log(destination)
                    if (destination === null){
                        setLoading(false)
                        enqueueSnackbar('Cloud not find your Delivery Address!', { variant: 'error' });
                        setConfirmModalOpen(false);
                        return;
                    }

                    destination.name = shippingAddressName;
                    destination.street = shippingAddressStreetAndNumber;
                    destination.city = shippingAddressCity;

                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: 'include',
                        body: JSON.stringify(
                            {
                                items, to, from, notes, groceryShop: shop, destination: destination
                            }
                        )
                    })
                    setLoading(false)

                    if (!res.ok) {
                        try {
                            setError((await res)?.msg?.toString() || "Unknown Error.")
                        } catch (e) {
                            setError("Unknown Error.")
                        }
                    } else {
                        onSubmit()
                        navigate("/buyer/my-orders")
                    }
                }
                }>
                    <Show when={!loading} fallback={<CircularProgress size={"1.5rem"} sx={{ color: "primary.dark" }} />}>
                        {/*TODO error handling*/}
                        <Show when={error === undefined} fallback={<strong>{error || "Error"}</strong>}>
                            Confirm
                        </Show>
                    </Show>
                </DarkButton>
                <OutlinedButton sx={{ "flexGrow": "1" }}
                    onClick={() => setConfirmModalOpen(false)}>Cancel</OutlinedButton>
            </Stack>
        </BaseModal>

    </Paper>
}
