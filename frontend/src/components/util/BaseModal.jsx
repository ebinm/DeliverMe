import {Modal, Paper} from "@mui/material";

export function BaseModal(props) {
    const {open, onClose, children, ...other} = props
    return <Modal open={open} onClose={onClose}
                  sx={{"display": "flex", "alignItems": "center", "justifyContent": "center"}}>
        <Paper sx={{"padding": "16px"}} {...other}>
            {children}
        </Paper>
    </Modal>

}