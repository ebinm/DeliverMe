import {Divider, Modal, Paper, Typography} from "@mui/material";
import {Show} from "./ControlFlow";

export function BaseModal(props) {

    const { open, onClose, title, children, sx, ...other } = props

    return (
        <Modal open={open} onClose={onClose}
            sx={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "borderRadius": 16 }}>

            <Paper sx={{ "display": "flex", "padding": "30px", "minHeight": "30%", "minWidth": "50%", "overflowY": "auto", "justifyContent": "space-between", "flexDirection": "column", ...sx }} {...other}>
                <Show when={title}>{() =>
                    <div>
                        <Typography align="center" fontWeight={"Bold"} variant="h5" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Divider sx={{mb:4}}/>
                    </div>
                }</Show>
                {children}
            </Paper>

        </Modal>
    )

}