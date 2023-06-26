import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const CreditCard = ({ cardName, cardNumber, expiration, cvc, handleCardNameChange, handleCardNumberChange, handleExpirationChange, handleCVCChange }) => {
  const textFieldStyle = {
    backgroundColor: '#EFF3EF',
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch">
      <Box>
        <Typography variant="subtitle1">Cardholder Name</Typography>
        <TextField
          label=""
          variant="outlined"
          value={cardName}
          onChange={handleCardNameChange}
          fullWidth
          margin="normal"
          style={textFieldStyle}
        />
      </Box>
      <Box>
        <Typography variant="subtitle1">Card Number</Typography>
        <TextField
          label=""
          variant="outlined"
          value={cardNumber}
          onChange={handleCardNumberChange}
          fullWidth
          margin="normal"
          style={{ backgroundColor: '#EFF3EF' }}
        />
      </Box>
      <Box display="flex" flexDirection="row">
        <Box flex={1}>
          <Typography variant="subtitle1">Expiration Date</Typography>
          <TextField
            label=""
            variant="outlined"
            value={expiration}
            onChange={handleExpirationChange}
            fullWidth
            margin="normal"
            style={{ backgroundColor: '#EFF3EF' }}
          />
        </Box>
        <Box flex={1} marginLeft={2}>
          <Typography variant="subtitle1">CVC</Typography>
          <TextField
            label=""
            variant="outlined"
            value={cvc}
            onChange={handleCVCChange}
            fullWidth
            margin="normal"
            style={{ backgroundColor: '#EFF3EF' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreditCard;
