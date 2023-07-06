import React, { useState } from "react";
import { Rating, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DarkButton, OutlinedButton } from "./Buttons";
import { BaseModal } from "./BaseModal";
import { PUT_FETCH_OPTIONS } from "../../util/util";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";


export function RatingModal({ open, onClose, order, buyer }) {

    const [rating, setRating] = useState(0)
    const [note, setNote] = useState("")


    return <BaseModal open={open} onClose={onClose} title={"Please leave a rating for:"}>
        <Stack direction={"column"} gap={"20px"} sx={{ "alignItems": "center", "justifyContent": "center" }}>
            <Avatar alt={buyer ? order?.createdBy?.firstName + " " + order?.createdBy?.lastName :
                order?.selectedBid.createdBy?.firstName + " " + order?.selectedBid.createdBy?.lastName}
                src={buyer ? order?.createdBy?.profilePicture :
                    order?.selectedBid.createdBy?.profilePicture}
                sx={{ width: "100px", height: "100px" }} />
            <Typography variant={"h5"} component={"h2"}>{buyer ? order.createdBy.firstName :
                order.selectedBid.createdBy.firstName} {buyer ? order.createdBy.lastName : order.selectedBid.createdBy.lastName}</Typography>
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

            <TextField sx={{ width: "100%" }} label={"Additional notes"} onChange={e => setNote(e.target.value)} value={note} />

            <Stack direction={"row"} sx={{ "alignSelf": "end" }} gap={"8px"}>
                <OutlinedButton onClick={() => onClose()}>Cancel</OutlinedButton>
                <DarkButton onClick={async () => {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/rate`, {
                        ...PUT_FETCH_OPTIONS,
                        body: JSON.stringify({
                            note, rating
                        })
                    })

                    if (res.ok) {
                        onClose()
                        return
                    }

                    // TODO error handling
                    // TODO use queuestack !!!
                    console.warn("Could not submit a rating")
                    console.warn(res)
                }}>Submit</DarkButton>
            </Stack>
        </Stack>
    </BaseModal>
}