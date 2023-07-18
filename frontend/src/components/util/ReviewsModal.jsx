import React from "react";
import {Box, CircularProgress, Divider, Grid, Paper, Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {DarkButton} from "./Buttons";
import {BaseModal} from "./BaseModal";
import Avatar from "@mui/material/Avatar";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment/moment";
import {useFetch} from "../../util/hooks";


export function ReviewsModal({open, onClose, customer, type}) {

    const [reviews, setReviews, loading] = useFetch(
        customer && `${process.env.REACT_APP_BACKEND}/api/reviews/${type}/${customer._id}`,
        {credentials: 'include'})


    if (!customer) {
        return null
    }

    return <BaseModal  open={open} onClose={onClose}
                      title={"Reviews of " + customer.firstName + " " + customer.lastName}>

        <Box sx={{maxHeight: "70vH", overflow: "auto", justifyItems: 'center', display: 'flex', flexDirection: 'column'}}>
            {loading && <CircularProgress sx={{ml:"50%"}}/>}
            {(reviews && (reviews.length === 0)) && !loading &&
                <Typography variant={"h6"}
                            align={"center"}
                            component={"h4"}>No reviews received yet!
                </Typography>}
            {reviews && !loading && reviews.map((item, i) => <SingleReview key={i} item={item}/>)}

        </Box>
        <Divider sx={{mb: 2}}/>

        <Stack direction={"row"} sx={{"alignSelf": "end"}} gap={"8px"}>
            <DarkButton onClick={() => onClose()}>Close</DarkButton>
        </Stack>

    </BaseModal>
}

function SingleReview(props) {
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))

    return (
        <Paper elevation={6} sx={{
            padding: "3%", margin: "2%", flexGrow: 1, backgroundColor: 'white', width: '95%'
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

                    </Grid>

                    <Rating name="Rating {props.item.firstName} {props.item.lastName}" precision={0.5}
                            size={desktop ? "large" : "small"} value={props.item.rating} readOnly/>

                </Stack>
            </Stack>

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
                    posted {moment(props.item.creationTime).fromNow()}
                </Typography>
            </>

        </Paper>
    )
}