import React, {useCallback, useRef, useState} from "react";
import Webcam from "react-webcam";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function TestExample() {
    const [img, setImg] = useState(null);
    const webcamRef = useRef();

    const videoConstraints = {
        facingMode: "user",
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
    }, [webcamRef]);

    return (
        <div className="Container">
            {img === null ? (
                <>
                    <Box>
                        <Webcam
                            audio={false}
                            mirrored={true}
                            height={400}
                            width={400}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />
                    </Box>
                    <Box>
                        <Button   sx={{ color: "gray" }} onClick={capture}>Capture a photo</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box>
                        <img src={img} alt="screenshot" className="mb-2" width="500" height="600"/>
                    </Box>
                    <Box>
                        <Button  sx={{ color: "gray" }} onClick={() => setImg(null)}>Retake</Button>
                    </Box>
                </>
            )}
        </div>
    );
}

export {TestExample};