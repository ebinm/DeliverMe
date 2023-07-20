import InfoIcon from "@mui/icons-material/Info";
import {Box, Fade, Paper, Popper, Typography} from "@mui/material";
import {useState} from "react";
import Stack from "@mui/material/Stack";
import HelpIcon from '@mui/icons-material/Help';

/**
 * An info icon which sill give extra information on hover.
 */
export function InfoPopper({children}) {
    return <HoverPopper overlay={children} delay={"0ms"}>
        <InfoIcon sx={{"color": "primary.dark", "cursor": "help"}}/>
    </HoverPopper>
}

/**
 * A small utility component for displaying helper text.
 */
export function HelperText({children}) {
    return <Stack alignItems={"center"} direction={"row"} gap={"16px"}>
        <HelpIcon sx={{"color": "info.light"}}/>
        <Typography>
            {children}
        </Typography>
    </Stack>
}

/**
 * A utility component for icons which shows a popover on hover.
 *
 * @param children: The component to be hovered above.
 * @param overlay: The content presented in the popover.
 * @param delay: The delay on the popovers fade in.
 * @param placement: The placement of the popover relative to the children.
 */
export function HoverPopper({children, overlay, delay = "0ms", placement="bottom-end"}) {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <>
            <Box
                display={"flex"}
                onMouseEnter={e => setAnchorEl(e.currentTarget)}
                onMouseLeave={() => setAnchorEl(null)}>
                {children}
            </Box>
            <Popper
                transition={true}
                placement={placement}
                sx={{
                    zIndex: 100000,
                    pointerEvents: 'none',
                }}
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                disableRestoreFocus
            >{({TransitionProps}) =>
                <Fade {...TransitionProps} style={{transitionDelay: delay}}>
                    <Paper sx={{"padding": "16px", "maxWidth": "320px"}}>
                        {overlay}
                    </Paper>
                </Fade>
            }
            </Popper>
        </>
    )
}
