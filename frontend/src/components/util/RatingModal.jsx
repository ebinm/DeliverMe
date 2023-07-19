import React, {useEffect, useMemo, useState} from "react";
import {CircularProgress, Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "./Buttons";
import {BaseModal} from "./BaseModal";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import {Show} from "./ControlFlow";
import {useSnackbar} from "notistack";
import {useFetch} from "../../util/hooks";

/**
 * This is a modal for rating the buyer and shopper.
 *
 */
export function RatingModal({open, onClose, order, buyer}) {

    const [rating, setRating] = useState(0)
    const [note, setNote] = useState("")

    const [loading, setLoading] = useState(false)

    const ratedCustomer = useMemo(() =>
            buyer ? order?.createdBy : order?.selectedBid?.createdBy
        , [buyer, order?.createdBy, order?.selectedBid?.createdBy])


    const [previousRating] = useFetch(open && ratedCustomer && order && `${process.env.REACT_APP_BACKEND}/api/reviews/${buyer ? 'buyer' : 'shopper'}/${ratedCustomer?._id}/order/${order?._id}`, {credentials: 'include'})

    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        if (previousRating) {
            setRating(previousRating.rating)
            setNote(previousRating.note)
        }
    }, [previousRating])

    useEffect(() => {
        if (!previousRating) {
            setRating(0)
            setNote("")
        }
    }, [ratedCustomer?._id])

    return <BaseModal open={open} onClose={onClose} title={"Please leave a rating for:"}>
        <Stack direction={"column"} gap={"20px"} sx={{"alignItems": "center", "justifyContent": "center"}}>
            <Avatar
                alt={ratedCustomer?.firstName + " " + ratedCustomer?.lastName}
                src={ratedCustomer?.profilePicture}
                sx={{width: "100px", height: "100px"}}/>
            <Typography variant={"h5"} textAlign={"center"} component={"h2"}>{buyer ? order?.createdBy?.firstName :
                order?.selectedBid?.createdBy?.firstName} {buyer ? order?.createdBy?.lastName : order?.selectedBid?.createdBy?.lastName}</Typography>
            <Rating
                size={"large"}
                name="rating-input"
                value={rating}
                max={5}
                precision={0.5}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
            />

            <TextField sx={{width: "100%"}} label={"Additional notes"} onChange={e => setNote(e.target.value)}
                       value={note}/>

            <Stack direction={{"xs": "column", "sm": "row"}} width={"100%"} justifyContent={"flex-end"} gap={"16px"}>
                <OutlinedButton onClick={() => {
                    onClose()
                }}>Cancel</OutlinedButton>
                <DarkButton onClick={async () => {
                    setLoading(true)
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/rate`, {
                        ...PUT_FETCH_OPTIONS,
                        body: JSON.stringify({
                            note, rating
                        })
                    })

                    setLoading(false)
                    if (res.ok) {
                        onClose()
                        return
                    }
                    enqueueSnackbar("Could not submit rating.", {variant: "error"})
                }}>

                    <Show when={!loading} fallback={<CircularProgress sx={{"alignSelf": "center"}}/>}>
                        Submit
                    </Show>
                </DarkButton>
            </Stack>
        </Stack>
    </BaseModal>
}