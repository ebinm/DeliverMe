import React, {useState} from "react";
import {Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {DarkButton, OutlinedButton} from "./Buttons";
import {BaseModal} from "./BaseModal";


export function RatingModal({open, onClose, orderId}) {

    // TODO move state upward or send rating from here (would require information on self and order)
    const [rating, setRating] = useState(5.0)


    return <BaseModal open={open} onClose={onClose}>
        <Stack direction={"column"} gap={"32px"} sx={{"alignItems": "center", "justifyContent": "center"}}>
            {/*TODO*/}
            <Typography variant={"h5"} component={"h2"}>Please leave a rating for TODO</Typography>

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

            <Stack direction={"row"} sx={{"alignSelf": "end"}} gap={"8px"}>
                <OutlinedButton onClick={() => onClose()}>Cancel</OutlinedButton>
                <DarkButton onClick={() => {
                    //TODO
                    console.warn("TODO")
                }}>Submit</DarkButton>
            </Stack>
        </Stack>
    </BaseModal>
}