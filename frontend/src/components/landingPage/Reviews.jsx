import React from 'react'
import {Avatar, Grid, Paper, Rating, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

function Reviews() {
    let shoppers = [
        {
            avatar: "images/SimonBrumer.jpeg",
            firstName: "Simon",
            lastName: "Brumer",
            buyers: [
                {
                    firstName: "Betty",
                    lastName: "Zhang",
                    review: {
                        rating: 5,
                        comment: "Simon is just perfect!",
                        date: new Date(2023, 4, 30)
                    }
                },
                {
                    firstName: "Ebin",
                    lastName: "Madan",
                    review: {
                        rating: 1,
                        comment: "Simon needs to take a shower!",
                        date: new Date(2023, 4, 25)
                    }
                }

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
                        comment: "Micheal was so quick with my delivery.",
                        date: new Date(2023, 2, 3)
                    }
                },
                {
                    firstName: "Jennifer",
                    lastName: "Lopez",
                    review: {
                        rating: 3,
                        comment: "I wanted bread from Penny not Rewe!",
                        date: new Date(2022, 0, 31)
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
    const desktop = useMediaQuery(theme.breakpoints.up("sm"))

    return (
        <Paper style={{
            padding: "40px", marginTop: 10, flexGrow: 1
        }}>
            <div>

                <Stack direction={"row"} alignItems={"center"} gap={"16px"} sx={{"alignItems": "center"}} mb={"32px"}>
                    <Avatar alt={props.item.firstName + " " + props.item.lastName} src={props.item.avatar}/>

                    <Stack direction={"row"} flexWrap={"wrap"} container columnGap={"16px"}
                           justifyContent={"space-between"} alignItems={"center"} flex={1}>
                        <Grid justifyContent="left" item xs>
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
                                Personal Shopper   &#8729;   {props.item.buyers.length} reviews
                            </Typography>
                        </Grid>

                        <Rating name="Rating {props.item.firstName} {props.item.lastName}" precision={0.5}
                                size={desktop ? "large" : "small"} value={averageRating(props.item.buyers)} readOnly/>

                    </Stack>
                </Stack>


                {props.item.buyers.map((item, i) => <Buyer key={i} item={item}/>)}
            </div>
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
                posted {calculatePastDays(props.item.review.date)}
            </Typography>
        </>
    )
}

function calculatePastDays(date) {
    let currentDate = new Date();
    let difference = currentDate.getTime() - date.getTime();
    let totalDays = Math.floor(difference / (1000 * 3600 * 24));

    if (totalDays === 0) {
        return "today"
    } else {
        if (totalDays < 30) {
            return totalDays + " days ago"
        } else {
            let totalMonths = Math.floor(totalDays / 30);

            if (totalMonths < 12) {

                if (totalMonths > 1) {
                    return totalMonths + " months ago"
                } else {
                    return totalMonths + " month ago"
                }

            } else {
                let totalYears = Math.floor(totalMonths / 12);

                if (totalYears > 1) {
                    return totalYears + " years ago"
                } else {
                    return totalYears + " year ago"
                }
            }

        }
    }
}

function averageRating(buyers) {
    let length = buyers.length;
    let agg = 0;
    for (let buyer of buyers) {
        agg += buyer.review.rating;
    }
    let result = agg / length
    console.log(result)
    return result
}

export default Reviews
