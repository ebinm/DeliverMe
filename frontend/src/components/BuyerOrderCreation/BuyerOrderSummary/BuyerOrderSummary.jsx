import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    FormGroup,
    Modal,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {OrderItemsOverview} from "../../MyOrders/OrderItemsOverview";
import {createSearchParams, Navigate, useLocation} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import {CustomerContext} from "../../../util/context/CustomerContext";
import {useCacheLocalStorageForCustomer, useFetch} from "../../../util/hooks";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "../../util/Buttons";
import {Show} from "../../util/ControlFlow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {DateDisplay} from "../../MyOrders/DateDisplay";

export function BuyerOrderSummary({
                                      items,
                                      to, from, notes,
                                      shop,
                                      onGoBack, onSubmit
                                  }) {

    const {customer, ready} = useContext(CustomerContext)
    const location = useLocation()

    const [shippingAddressCountry, setShippingAddressCountry] = useCacheLocalStorageForCustomer("address-country-cache", "")
    const [shippingAddressName, setShippingAddressName] = useCacheLocalStorageForCustomer("address-name-cache", "")
    const [shippingAddressStreetAndNumber, setShippingAddressStreetAndNumber] = useCacheLocalStorageForCustomer("address-street-cache", "")
    const [shippingAddressZipCode, setShippingAddressZipCode] = useCacheLocalStorageForCustomer("address-zip-code-cache", "")
    const [shippingAddressCity, setShippingAddressCity] = useCacheLocalStorageForCustomer("address-city-cache", "")

    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [shippingOpen, setShippingOpen] = useState(true)

    // We use the endpoint state as a trigger for the fetch. Whilst it is undefined, we do not issue a fetch
    const [postEndpointSignal, setPostEndpointSignal] = useState(undefined)
    const [, , loading, error] = useFetch(postEndpointSignal, {
        method: "POST",
        body: JSON.stringify({
            items, to, from, notes, shop, shippingAddress: {
                country: shippingAddressCountry,
                name: shippingAddressName,
                street: shippingAddressStreetAndNumber,
                zipCode: shippingAddressZipCode,
                city: shippingAddressCity,
            }
        })
    }, () => {
        // TODO handle success
        console.log("TODO success")
        setPostEndpointSignal(undefined)
        // Clear caches
        onSubmit()
    })

    useEffect(() => {
        // Used to set the default value as soon as the customer is available. The default value prop cannot be used
        // with controlled input apparently
        if (customer?._id) {
            setShippingAddressName(`${customer.firstName} ${customer.lastName}`)
        }
    }, [customer?._id])

    const formRef = useRef()

    if (!ready) {
        return <CircularProgress/>
    }

    if (!customer) {
        return <Navigate to={{
            pathname: "/buyer/signup",
            search: createSearchParams({
                "ref": location.pathname
            }).toString()
        }}/>
    }

    return <Paper sx={{"borderRadius": "16px"}}>
        <Typography component={"h2"} variant={"h5"}
                    sx={{"alignSelf": "center", "padding": "16px"}}>Checkout</Typography>

        <OrderItemsOverview items={items} defaultExpanded={false} title={"Items"}/>


        <Accordion expanded={shippingOpen} onChange={(ignored, b) => setShippingOpen(b)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography color={"text.light"} variant={"h6"} component={"h3"}>Shipping</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <form ref={formRef} onSubmit={e => e.preventDefault()}>
                    <FormGroup>
                        <Stack direction={"column"} gap={"16px"}>
                            <TextField label={"Country"} onChange={e => setShippingAddressCountry(e.target.value)}
                                       required
                                       value={shippingAddressCountry}/>
                            <TextField label={"Full name"} required
                                       onChange={e => setShippingAddressName(e.target.value)}
                                       value={shippingAddressName}/>
                            <TextField label={"Street name and house number"} required
                                       onChange={e => setShippingAddressStreetAndNumber(e.target.value)}
                                       value={shippingAddressStreetAndNumber}/>

                            <TextField label={"Zip code"} required
                                       onChange={e => setShippingAddressZipCode(e.target.value)}
                                       value={shippingAddressZipCode}/>

                            <TextField label={"City"} required
                                       onChange={e => setShippingAddressCity(e.target.value)}
                                       value={shippingAddressCity}/>
                        </Stack>
                    </FormGroup>
                </form>

                <Show when={to || from || notes}>
                    <Stack padding={"32px 0"}>
                        <Typography color={"text.light"} variant={"h6"} component={"h3"}>Extras</Typography>
                        <DateDisplay from={from} to={to}/>
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

        <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}
               sx={{"display": "flex", "alignItems": "center", "justifyContent": "center"}}>
            <Paper>
                <Typography sx={{"padding": "16px"}}>Are you sure you want to place the order?</Typography>
                <Stack direction={"row-reverse"} justifyContent={"space-between"} gap={"16px"} padding={"16px"}>
                    <DarkButton sx={{"flexGrow": "1"}} onClick={async () => {
                        setPostEndpointSignal("/api/buyer/order")
                    }}>
                        <Show when={!loading} fallback={<CircularProgress size={"1.5rem"}/>}>
                            {/*TODO error handling*/}
                            <Show when={error === undefined} fallback={<strong>{error?.msg || "Error"}</strong>}>
                                Confirm
                            </Show>
                        </Show>
                    </DarkButton>
                    <OutlinedButton sx={{"flexGrow": "1"}}
                                    onClick={() => setConfirmModalOpen(false)}>Cancel</OutlinedButton>
                </Stack>
            </Paper>
        </Modal>

    </Paper>
}