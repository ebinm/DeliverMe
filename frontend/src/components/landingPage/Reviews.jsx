import React from 'react'
import {Avatar, Grid, Paper, Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";

function Reviews() {
    let shoppers = [
        {
            avatar: "images/SimonBrumer.jpeg",
            firstName: "Simon",
            lastName: "Brumer",
            buyers: [
                {
                    firstName: "Kate",
                    lastName: "Abdo",
                    review: {
                        rating: 5,
                        comment: "Worked with him before. Always a pleasure!",
                        date: new Date(2023, 6, 30)
                    }
                },
                {
                    firstName: "Ebin",
                    lastName: "Madan",
                    review: {
                        rating: 4,
                        comment: "He was very careful and quick with my delivery.",
                        date: new Date(2023, 4, 25)
                    }
                },
                {
                    firstName: "Max",
                    lastName: "Mustermann",
                    review: {
                        rating: 4,
                        comment: "I wanted Bread and Milk, I got Bread and Milk.",
                        date: new Date(2023, 2, 25)
                    }
                },

            ]

        },
        {
            avatar: "images/MichealJordan.jpg",
            firstName: "Micheal",
            lastName: "Jordan",
            buyers: [
                {
                    firstName: "Barack",
                    lastName: "Obama",
                    review: {
                        rating: 4,
                        comment: "I placed the order and Micheal was already here.",
                        date: new Date(2023, 5, 3)
                    }
                },
                {
                    firstName: "Jennifer",
                    lastName: "Lopez",
                    review: {
                        rating: 3,
                        comment: "He did a great job. Can recommend!",
                        date: new Date(2023, 5, 31)
                    }
                }

            ]

        },

    ]

    return (
        <Stack direction={"column"} style={{justifySelf: 'center', "width": "100%", "maxWidth": "1400px"}}>
            <Typography variant="h3" sx={{
                mt: "32px",
                justifySelf: 'center',
                paddingTop: '50px',
                paddingBottom: '50px',
                textAlign: 'center',
                fontWeight: '500',
                fontSize: '2rem',
                lineHeight: '1.6',
                letterSpacing: '0.0075em',
            }}>
                Featured Personal Shoppers
            </Typography>
            {shoppers.map((item, i) => <SingleReview key={i} item={item}/>)}
        </Stack>
    )
}

function SingleReview(props) {
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))

    return (
        <Paper style={{
            padding: "40px", marginTop: 10, flexGrow: 1
        }}>
            <Stack direction={"row"} alignItems={"center"} gap={"16px"} sx={{"alignItems": "center"}} mb={"32px"}>
                <Avatar alt={props.item.firstName + " " + props.item.lastName} src={props.item.avatar}/>

                <Stack direction={"row"} flexWrap={"wrap"} columnGap={"16px"}
                       justifyContent={"space-between"} alignItems={"center"} flex={1}>
                    <Grid justifyContent="left" item xs sx={{"minWidth": "70%"}}>
                        <Typography variant="h5" sx={{
                            margin: 0,
                            textAlign: "left"
                        }}>
                            {props.item.firstName + " " + props.item.lastName}
                        </Typography>
                        <Typography sx={{
                            margin: 0,
                            textAlign: "left",
                            opacity: 0.7,
                            marginBottom: 1
                        }}>
                            Personal Shopper   &#8729;   {props.item.buyers.length}&nbsp;reviews
                        </Typography>
                    </Grid>

                    <Rating name="Rating {props.item.firstName} {props.item.lastName}" precision={0.5}
                            size={desktop ? "large" : "small"} value={averageRating(props.item.buyers)} readOnly/>

                </Stack>
            </Stack>

            {props.item.buyers.map((item, i) => <Buyer key={i} item={item}/>)}
        </Paper>
    )
}

function Buyer(props) {
    return (
        <>
            <Typography sx={{
                textAlign: "left",
                marginTop: 0.5,
                marginBottom: 0
            }}>
                <span style={{fontWeight: "bold"}}>{props.item.firstName} {props.item.lastName}: </span>
                {props.item.review.comment}
            </Typography>
            <Typography sx={{
                marginTop: 0,
                opacity: 0.7,
                textAlign: "left",
                marginBottom: 1.5,
                fontSize: '0.8rem'
            }}>
                posted {moment(props.item.review.date).fromNow() }
            </Typography>
        </>
    )
}

function averageRating(buyers) {
    let agg = 0;
    for (let buyer of buyers) {
        agg += buyer.review.rating;
    }
    return agg / buyers.length
}

export default Reviews
