import {Modal, Paper} from "@mui/material";

export function BaseModal(props) {
    const {open, onClose, children, sx, ...other} = props
    return <Modal open={open} onClose={onClose}
                  sx={{"display": "flex", "alignItems": "center", "justifyContent": "center"}}>
        <Paper sx={{"padding": "16px", "maxHeight": "80vh", "overflowY": "auto",  ...sx}} {...other}>
            {children}
        </Paper>
    </Modal>

}