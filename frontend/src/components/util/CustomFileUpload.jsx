import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {FileUploader} from "react-drag-drop-files";
import React, {useState} from "react";


export function CustomFileInput({img, setImg, id = "file-uploader", defaultLabel}) {

    const [uploadFeedback, setUploadFeedback] = useState(defaultLabel)


    return <FileUploader maxSize={32} id={id}
                         required={false} multiple={false} name="file" types={["JPG", "PNG", "JPEG"]}
                         onTypeError={(err) => setUploadFeedback(err)}
                         onSizeError={(err) => setUploadFeedback(err)}
                         handleChange={(file) => {
                             const fileReader = new FileReader();
                             fileReader.onload = () => {
                                 setImg(fileReader.result)
                                 setUploadFeedback("Successfully uploaded. (Upload again to replace)")
                             }
                             fileReader.readAsDataURL(file)
                         }}
    >
        <Stack direction={"column"} gap={"16px"} justifyContent={"center"}
               alignItems={"center"} sx={{
            "marginTop": "16px",
            "borderWidth": "3px",
            "borderStyle": "dashed",
            "borderRadius": "16px",
            "padding": "16px",
            "borderColor": "primary.dark"
        }}>
            <CloudUploadIcon sx={{"color": "primary.dark", "fontSize": "2rem"}}/>
            <Typography sx={{"color": "primary.dark"}}> {uploadFeedback}</Typography>
            <Box component={"img"} src={img} sx={{"maxHeight": "10vh"}}/>
        </Stack>
    </FileUploader>


}