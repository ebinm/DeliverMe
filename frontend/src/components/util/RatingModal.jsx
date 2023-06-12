import React, {useState} from "react";
import {Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "./Buttons";
import {BaseModal} from "./BaseModal";


export function RatingModal({open, onClose, orderId}) {

    // TODO move state upward or send rating from here (would require information on self and order)
    const [rating, setRating] = useState(5.0)


    return <BaseModal open={open} onClose={onClose}>
        <Stack direction={"column"} sx={{"alignItems": "center", "justifyContent": "center"}}>
            {/*TODO*/}
            <Typography>Please leave a rating for TODO</Typography>

            <Rating
                name="rating-input"
                value={rating}
                max={5}
                precision={0.5}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
            />

            <Stack direction={"row"}>
                <OutlinedButton>Cancel</OutlinedButton>
                <DarkButton>Submit</DarkButton>
            </Stack>
        </Stack>
    </BaseModal>
}