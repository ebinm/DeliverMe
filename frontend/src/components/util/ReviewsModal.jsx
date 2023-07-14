import React from "react";
import {Box, Divider, Grid, Paper, Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import { DarkButton } from "./Buttons";
import { BaseModal } from "./BaseModal";
import Avatar from "@mui/material/Avatar";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment/moment";
import {useFetch} from "../../util/hooks";


export function ReviewsModal({ open, onClose, customer }) {

    const [reviews, setReviews, loading] = useFetch(
        customer && `${process.env.REACT_APP_BACKEND}/api/reviews/buyer/${customer._id}`,
        {credentials: 'include'})

    if (!customer) {
        return null
    }

    return <BaseModal open={open} onClose={onClose} title={"Reviews of " + customer.firstName + " " + customer.lastName}>
        {/*<Stack direction={"column"} gap={"20px"} sx={{ "alignItems": "center", "justifyContent": "center" }}>*/}
        {/*    <Avatar alt={buyer ? order?.createdBy?.firstName + " " + order?.createdBy?.lastName :*/}
        {/*        order?.selectedBid.createdBy?.firstName + " " + order?.selectedBid.createdBy?.lastName}*/}
        {/*            src={buyer ? order?.createdBy?.profilePicture :*/}
        {/*                order?.selectedBid.createdBy?.profilePicture}*/}
        {/*            sx={{ width: "100px", height: "100px" }} />*/}
        {/*    <Typography variant={"h5"} component={"h2"}>{buyer ? order.createdBy.firstName :*/}
        {/*        order.selectedBid.createdBy.firstName} {buyer ? order.createdBy.lastName : order.selectedBid.createdBy.lastName}</Typography>*/}
        {/*    <Rating*/}
        {/*        size={"large"}*/}
        {/*        name="rating-input"*/}
        {/*        value={rating}*/}
        {/*        max={5}*/}
        {/*        precision={0.5}*/}
        {/*        onChange={(event, newValue) => {*/}
        {/*            setRating(newValue);*/}
        {/*        }}*/}
        {/*    />*/}

        {/*    <TextField sx={{ width: "100%" }} label={"Additional notes"} onChange={e => setNote(e.target.value)} value={note} />*/}

        {/*    <Stack direction={"row"} sx={{ "alignSelf": "end" }} gap={"8px"}>*/}
        {/*        <OutlinedButton onClick={() => onClose()}>Cancel</OutlinedButton>*/}
        {/*        <DarkButton onClick={async () => {*/}
        {/*            setLoading(true)*/}
        {/*            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/rate`, {*/}
        {/*                ...PUT_FETCH_OPTIONS,*/}
        {/*                body: JSON.stringify({*/}
        {/*                    note, rating*/}
        {/*                })*/}
        {/*            })*/}

        {/*            setLoading(false)*/}
        {/*            if (res.ok) {*/}
        {/*                onClose()*/}
        {/*                return*/}
        {/*            }*/}
        {/*            enqueueSnackbar("Could not submit rating.", {variant: "error"})*/}

        {/*            // TODO error handling*/}
        {/*            // TODO use queuestack !!!*/}
        {/*            console.warn("Could not submit a rating")*/}
        {/*            console.warn(res)*/}
        {/*        }}>*/}

        {/*            <Show when={!loading} fallback={<CircularProgress sx={{"alignSelf": "center"}}/>}>*/}
        {/*                Submit*/}
        {/*            </Show>*/}

        {/*        </DarkButton>*/}
        {/*    </Stack>*/}
        {/*</Stack>*/}
        <Box sx={{maxHeight: "70vH", overflow: "auto"}}>

            {reviews && reviews.map((item, i) => <SingleReview key={i} item={item}/>)}
        </Box>
        <Divider sx={{mb:2}}/>

        <Stack direction={"row"} sx={{ "alignSelf": "end" }} gap={"8px"}>
            <DarkButton onClick={() => onClose()}>Close</DarkButton>
        </Stack>

    </BaseModal>
}

function SingleReview(props) {
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))

    return (
        <Paper elevation={4} sx={{
            padding: "5%", marginTop: "2%", flexGrow: 1, backgroundColor: 'white', width: '100%'
        }}>
            <Stack direction={"row"} alignItems={"center"} gap={"5%"} sx={{"alignItems": "center"}} mb={"5%"}>
                <Avatar alt={props.item.createdBy.firstName + " " + props.item.createdBy.lastName}
                        src={props.item.createdBy.profilePicture}/>

                <Stack direction={"row"} flexWrap={"wrap"} columnGap={"16px"}
                       justifyContent={"space-between"} alignItems={"center"} flex={1}>
                    <Grid justifyContent="left" item xs sx={{"minWidth": "70%"}}>
                        <Typography variant="h5" sx={{
                            margin: 0,
                            textAlign: "left"
                        }}>
                            {props.item.createdBy.firstName + " " + props.item.createdBy.lastName}
                        </Typography>
                        {/*<Typography sx={{*/}
                        {/*    margin: 0,*/}
                        {/*    textAlign: "left",*/}
                        {/*    opacity: 0.7,*/}
                        {/*    marginBottom: 1*/}
                        {/*}}>*/}
                        {/*    Personal Shopper   &#8729;   {props.item.buyers.length}&nbsp;reviews*/}
                        {/*</Typography>*/}
                    </Grid>

                    <Rating name="Rating {props.item.firstName} {props.item.lastName}" precision={0.5}
                            size={desktop ? "large" : "small"} value={props.item.rating} readOnly/>

                </Stack>
            </Stack>

            {/*<Typography sx={{*/}
            {/*    margin: 0,*/}
            {/*    textAlign: "left",*/}
            {/*    opacity: 0.7,*/}
            {/*    marginBottom: 1*/}
            {/*}}>*/}
            {/*    {props.item.note}*/}
            {/*</Typography>*/}

            <>
                <Typography sx={{
                    textAlign: "left",
                    marginTop: 0.5,
                    marginBottom: 0
                }}>
                    {props.item.note}
                </Typography>
                <Typography sx={{
                    marginTop: 0,
                    opacity: 0.7,
                    textAlign: "left",
                    marginBottom: 1.5,
                    fontSize: '0.8rem'
                }}>
                    posted {moment(props.item.creationTime).fromNow() }
                </Typography>
            </>

        </Paper>
    )
}