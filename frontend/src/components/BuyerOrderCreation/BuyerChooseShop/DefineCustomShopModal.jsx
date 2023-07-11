import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {Autocomplete} from '@react-google-maps/api';
import {useSnackbar} from 'notistack';
import {BaseModal} from "../../util/BaseModal"
import {DarkButton, OutlinedButton} from "../../util/Buttons";

const DefineCustomShopModal = ({
    showModal,
    handleCloseModal,
    searchValue,
    setSearchValue,
    handleCustomShopSelect
}) => {

    const [autocomplete, setAutocomplete] = useState(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const { enqueueSnackbar } = useSnackbar();


    const handleSubmit = (e) => {
        e.preventDefault();

        if (name === '') {
            console.log("No place selected");
            enqueueSnackbar('Please add a name for your shop!', { variant: 'error' });
            return;
        }

        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                console.log("Custom Selected Place: ", place);

                const [street, postalCodeCity, country] = place.formatted_address.split(', ');
                if (postalCodeCity == null) {
                    enqueueSnackbar('Your address has no street!', { variant: 'error' });
                    return;
                }
                const [address, city] = postalCodeCity.split(' ');

                place.name = name;
                place.city = city;
                place.street = street;

                handleCustomShopSelect(place);
                setAddress(place.formatted_address);
                handleCloseModal();
            } else {
                console.log("No place selected");
                enqueueSnackbar('Select an address from the list!', { variant: 'error' });
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
                title={"Define a Custom Shop"}
            >
                <>
                    <form>
                        <>
                            <TextField
                                required
                                id="outlined"
                                label="Shop Name"
                                sx={{ width: '100%', mb: 4, backgroundColor: 'white' }}
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
                                    placeholder=" Search for a place *"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    style={{ width: "100%", height: "3rem" }}
                                />
                            </Autocomplete>
                        </>
                    </form>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{ mt: 4, justifyContent: 'space-between' }}
                    >
                        <OutlinedButton onClick={handleCloseModal}>Back</OutlinedButton>
                        <DarkButton onClick={handleSubmit}>Select Shop</DarkButton>
                    </Stack>
                </>
            </BaseModal>
        </div>
    );
};

export default DefineCustomShopModal;