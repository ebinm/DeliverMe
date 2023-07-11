import React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import {For, Show} from "../util/ControlFlow";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";


const Journey = () => {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))

    const sectionItems = [{
        id: 1,
        src: "images/journey1.svg",
        alt: "Journey1",
        offset: "60px",
        title: 'Location',
        sentence: 'Choose a grocery store in your area',
    }, {
        id: 2,
        alt: "Journey2",
        offset: "120px",
        src: "images/journey2.svg",
        title: 'Shop groceries',
        sentence: 'Specify the groceries that you want',
    }, {
        id: 3,
        alt: "Journey3",
        offset: "120px",
        src: "images/journey3.svg",
        title: 'Personal Shopper',
        sentence: 'Select a personal shopper for the delivery',
    }, {
        id: 4,
        alt: "Journey4",
        offset: "60px",
        src: "images/journey4.svg",
        title: 'Groceries',
        sentence: 'Receive the groceries at your home',
    },];

    return <Show when={desktop} fallback={() => <MobileJourney sectionItems={sectionItems}/>}>{() => <DesktopJourney
        sectionItems={sectionItems}/>}</Show>

};

function MobileJourney({sectionItems}) {
    return <Stack gap={"16px"}>
        <Typography variant="h3" sx={{
            mt: "32px",
            justifySelf: 'center',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: '2rem',
            lineHeight: '1.6',
            letterSpacing: '0.0075em',
        }}>
            We bring your order wherever you are!
        </Typography>

        <For each={sectionItems}>{({src, alt, title, sentence, id}) => <MobileJourneyItem key={id} src={src} alt={alt}
                                                                                          text={sentence}
                                                                                          title={title}/>}</For>
    </Stack>
}

function MobileJourneyItem({title, text, src, alt}) {
    return <Paper sx={{padding: "16px"}}>
        <Box display={"grid"} gridTemplateColumns={"minmax(min-content, max-content) auto"} alignItems={"center"} columnGap={"24px"}>
            <Box component={"img"} src={src} alt={alt} width={'100%'}
                 gridRow={"span 2"} maxWidth={"140px"} minWidth={"80px"} sx={{"aspectRatio": 1}}/>
            <Typography variant="h3" sx={{
                alignSelf: "end", fontWeight: '500', fontSize: '1.25rem', lineHeight: '1.6', letterSpacing: '0.0075em',
            }}>
                {title}
            </Typography>
            <Typography sx={{
                alignSelf: "start", color: "text.light"
            }}>
                {text}
            </Typography>
        </Box>
    </Paper>
}

function DesktopJourney({sectionItems}) {

    return (<Box sx={{
        display: 'grid',
        minHeight: '400px',
        backgroundColor: '#F8F9F5',
        justifyContent: 'center',
        paddingTop: '50px',
        paddingBottom: '50px'
    }}>
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
            alignItems: 'top',
            justifyContent: 'space-around',
            maxWidth: '1600px',
        }}>
            {sectionItems.map((item) => (<Grid
                item
                xs={12}
                md={2.5}
                minHeight={300}
                key={item.id}
                sx={{
                    maxHeight: '500px',
                    textAlign: 'center',
                    // padding: '30px',
                    maxWidth: '200px',
                    borderRadius: '10px',
                    margin: '10px !important',
                }}
            >
                <Box component={"img"} src={item.src} alt={item.alt} width={'100%'} maxWidth={"50vw"}
                     style={{padding: "20px", paddingBottom: "60px", paddingTop: item.offset}}/>
                <Typography variant="h3" sx={{
                    fontWeight: '500', fontSize: '1.25rem', lineHeight: '1.6', letterSpacing: '0.0075em',
                }}>
                    {item.title}
                </Typography>
                <Typography sx={{
                    color: "text.light"
                }}>
                    {item.sentence}
                </Typography>
            </Grid>))}
        </Grid>
    </Box>);
}

export default Journey;


