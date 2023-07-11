import InfoIcon from "@mui/icons-material/Info";
import {Paper, Popover} from "@mui/material";
import {useState} from "react";

export function InfoPopover({children}) {
    const [anchorEl, setAnchorEl] = useState(null);

    return <>
        <InfoIcon sx={{"color": "primary.dark", "cursor": "help"}}
                  onMouseEnter={e => setAnchorEl(e.currentTarget)}
                  onMouseLeave={() => setAnchorEl(null)}/>
        <Popover
            sx={{
                pointerEvents: 'none',
            }}
            open={!!anchorEl}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={() => setAnchorEl(null)}
            disableRestoreFocus
        >
            <Paper sx={{"padding": "16px", "maxWidth": "320px"}}>
                {children}
            </Paper>
        </Popover>
    </>
}
