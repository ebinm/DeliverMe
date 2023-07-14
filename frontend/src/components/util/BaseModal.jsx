import {Divider, Modal, Paper, Typography} from "@mui/material";
import {Show} from "./ControlFlow";

/**
 * A base modal to be used to ensure a unified style. The modal accepts will apply unknown props to the
 * paper container of the modal.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function BaseModal(props) {

    const {open, onClose, title, children, sx, ...other} = props

    return (
        <Modal open={open} onClose={onClose}
               sx={{"display": "flex", "alignItems": "center", "justifyContent": "center", "borderRadius": 16}}>

            <Paper sx={{
                "display": "flex",
                "padding": "30px",
                "minHeight": "30%",
                "minWidth": "30%",
                "justifyContent": "space-between",
                "flexDirection": "column",
                "maxHeight": "90vh",
                "overflow": "auto", ...sx
            }} {...other}>
                <Show when={title}>{() =>
                    <div>
                        <Typography align="center" fontWeight={"Bold"} variant="h5" sx={{mb: 1}}>
                            {title}
                        </Typography>
                        <Divider sx={{mb: 4}}/>
                    </div>
                }</Show>
                {children}
            </Paper>

        </Modal>
    )

}