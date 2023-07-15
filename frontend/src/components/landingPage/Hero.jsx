import {Box, Grid, Typography} from "@mui/material";
import Pictures from "./Carousel";
import {DarkButton} from "../util/Buttons";
import React from "react";
import {NavLink} from "react-router-dom";

const Hero = () => {

    return (<Box sx={{
        width: '100%', display: 'flex', minHeight: '600px', alignItems: 'center', justifyContent: 'center',
    }}>
        <Grid container spacing={6} sx={{
            display: 'flex', alignItems: 'center', maxWidth: '1500px',
        }}>
            <Grid item xs={12} md={7}>
                <Typography variant="h1" fontWeight={700} sx={{
                    fontSize: '3.75rem',
                    lineHeight: '1.167',
                    letterSpacing: '-0.01562em',
                    fontWeight: '700',
                    paddingBottom: '15px',
                }}>
                    Let us do your groceries
                </Typography>
                <Typography variant="h2" sx={{
                    fontWeight: '500',
                    fontSize: '1.5rem',
                    lineHeight: '1.6',
                    letterSpacing: '0.0075em',
                    opacity: '0.6',
                    paddingBottom: '30px',
                }}>
                    Hire personal shoppers who will help you with your groceries so that you can save time and
                    effort.
                    With DeliverMe you can get your groceries from any local store delivered to your door step.
                </Typography>
                <NavLink to={"/buyer/order/create"}>
                    <DarkButton
                        sx={{
                            maxWidth: '400px', height: '60px', fontSize: '16px', width: "100%"
                        }}
                    >
                        ORDER NOW
                    </DarkButton>
                </NavLink>
            </Grid>
            <Grid item xs={12} md={5}>
                <Pictures/>
            </Grid>
        </Grid>
    </Box>);
};

export default Hero;