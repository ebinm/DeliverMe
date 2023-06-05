import React from 'react';
import {Grid, Typography, Box} from '@mui/material';


const Journey = () => {

    const sectionItems = [
        {
            id: 1,
            icon: <img src="images/journey1.png" alt="Journey1" width={'100%'}
                       style={{padding: "20px", paddingBottom: "60px",}}/>,
            title: 'Location',
            sentence:
                'Choose a grocery store in your area',
        },
        {
            id: 2,
            icon: <img src="images/journey2.png" alt="Journey1" width={'100%'}
                       style={{padding: "20px", paddingBottom: "60px", paddingTop: "120px"}}/>,
            title: 'Shop groceries',
            sentence:
                'Specify the groceries that you want',
        },
        {
            id: 3,
            icon: <img src="images/journey3.png" alt="Journey1" width={'100%'}
                       style={{padding: "20px", paddingBottom: "60px", paddingTop: "120px"}}/>,
            title: 'Personal Shopper',
            sentence: 'Select a personal shopper for the delivery',
        },
        {
            id: 4,
            icon: <img src="images/journey4.png" alt="Journey1" width={'100%'}
                       style={{padding: "20px", paddingBottom: "60px"}}/>,
            title: 'Groceries',
            sentence: 'Receive the groceries at your home',
        },
    ];
    return (
        <Box sx={{display: 'grid', minHeight: '400px', backgroundColor: '#F8F9F5', justifyContent: 'center',
            paddingTop: '50px', paddingBottom: '50px'}}>
            <Typography variant="h3" sx={{
                justifySelf: 'center',
                textAlign: 'center',
                fontWeight: '500',
                fontSize: '2rem',
                lineHeight: '1.6',
                letterSpacing: '0.0075em',
            }}>
                We bring your order wherever you are!
            </Typography>
            <Grid container sx={{
                display: 'flex',
                justifySelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '1200px',
                maxWidth: '1600px',
                minHeight: '500px',
            }}>
                {sectionItems.map((item) => (
                    <Grid
                        item
                        xs={12}
                        md={2.5}
                        minHeight={300}
                        key={item.id}
                        sx={{
                            maxHeight: '500px',
                            textAlign: 'center',
                            padding: '30px',
                            maxWidth: '200px',
                            borderRadius: '10px',
                            margin: '10px !important',
                        }}
                    >
                        {item.icon}
                        <Typography variant="h3" sx={{
                            fontWeight: '500',
                            fontSize: '1.25rem',
                            lineHeight: '1.6',
                            letterSpacing: '0.0075em',
                        }}>
                            {item.title}
                        </Typography>
                        <Typography sx={{
                            opacity: '0.6',
                        }}>
                            {item.sentence}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Journey;


