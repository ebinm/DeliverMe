import React, {useState} from 'react';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {useTheme} from "@mui/material/styles"
import {Autocomplete} from '@react-google-maps/api';
import {useSnackbar} from 'notistack';
import {BaseModal} from "../../util/BaseModal"

const DefineCustomShopModal = ({
                                   showModal,
                                   handleCloseModal,
                                   searchValue,
                                   setSearchValue,
                                   handleCustomShopSelect
                               }) => {

    const theme = useTheme()
    const [autocomplete, setAutocomplete] = useState(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const {enqueueSnackbar} = useSnackbar();

    const style = {
        width: "100vh",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: theme.palette.primary.main,
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place) {
                place.name = name;

                console.log("Selected AutoComplete place: ", place);
                handleCustomShopSelect(place);
                setAddress(place.formatted_address);
                handleCloseModal();
            } else {
                console.log("No place selected");
                enqueueSnackbar('Select an Address from the List', 'error');
            }
        }
    };

    const selectAutoComplete = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            setAddress(place.formatted_address);
        }
    }

    return (
        <div>
            <BaseModal
                open={showModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>


                        <Typography variant="h4" sx={{mb: 2}}>
                            Define Custom Shop
                        </Typography>
                        <Box
                            sx={{width: "100%"}}
                        >
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <TextField
                                        required
                                        id="outlined"
                                        label="Shop Name"
                                        sx={{width: '100%', mb: 4, backgroundColor: 'white'}}
                                        onChange={(e) => setName(
                                            e.target.value
                                        )}
                                    />

                                    <Autocomplete
                                        onLoad={autocomplete => setAutocomplete(autocomplete)}
                                        onPlaceChanged={selectAutoComplete}
                                    >
                                        <input
                                            required
                                            type="text"
                                            placeholder="Search for a place"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            style={{width: "100%"}}
                                        />
                                    </Autocomplete>


                                    <Stack
                                        direction={{xs: 'column', sm: 'row'}}
                                        spacing={{xs: 1, sm: 1, md: 1}}
                                        sx={{mt: 4, justifyContent: 'space-between'}}
                                    >
                                        <Button variant="contained" onClick={handleCloseModal}>Back</Button>
                                        <Button variant="contained" type="submit">Select Shop</Button>
                                    </Stack>
                                </div>
                            </form>
                        </Box>
                    </Box>
                </>
            </BaseModal>
        </div>
    );
};

export default DefineCustomShopModal;