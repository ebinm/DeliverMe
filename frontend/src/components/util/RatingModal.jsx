import React, {useState} from "react";
import {Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "./Buttons";
import {BaseModal} from "./BaseModal";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import TextField from "@mui/material/TextField";


export function RatingModal({open, onClose, order}) {

    const [rating, setRating] = useState(5.0)
    const [note, setNote] = useState("")


    return <BaseModal open={open} onClose={onClose}>
        <Stack direction={"column"} gap={"32px"} sx={{"alignItems": "center", "justifyContent": "center"}}>
            <Typography variant={"h5"} component={"h2"}>Please leave a rating for {order.createdBy.firstName} {order.createdBy.lastName}</Typography>

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

            <TextField sx={{width: "100%"}} label={"Additional notes"} onChange={e => setNote(e.target.value)} value={note}/>

            <Stack direction={"row"} sx={{"alignSelf": "end"}} gap={"8px"}>
                <OutlinedButton onClick={() => onClose()}>Cancel</OutlinedButton>
                <DarkButton onClick={async () => {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/rate`, {
                        ...PUT_FETCH_OPTIONS,
                        body: JSON.stringify({
                            note, rating
                        })
                    })

                    if(res.ok){
                        onClose()
                        return
                    }

                    // TODO error handling
                    console.warn("Could not submit a rating")
                    console.warn(res)
                }}>Submit</DarkButton>
            </Stack>
        </Stack>
    </BaseModal>
}