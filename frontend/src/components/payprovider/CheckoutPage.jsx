import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PaymentForm from './PaymentForm';

const theme = createTheme();

const containerStyle = {
  height: '70vh',
  width: '70vw',
  margin: '20px',
  display: 'flex',
  flexDirection: 'column',
};

const lineStyle = {
  borderBottom: '1px solid #E2E8F0',
  width: '95%',
  margin: '10px',
};

const contentStyle = {
  margin: '40px',
  flex: 1,
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const CheckoutPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={containerStyle}>
          <div>
            <Typography component="h1" variant="h5" align="left">
              Payment Details
            </Typography>
          </div>
          <div style={lineStyle} />
          <div style={contentStyle}>
            <div style={rowStyle}>
              <Typography variant="body1">Delivery Costs (with fee)</Typography>
              <Typography variant="body1">20 euro</Typography>
            </div>
            <div style={rowStyle}>
              <Typography variant="body1">Grocery Bill</Typography>
              <Typography variant="body1">50 euro</Typography>
            </div>
            <div style={rowStyle}>
              <Typography variant="body1">Total</Typography>
              <Typography variant="body1">70 euro</Typography>
            </div>
          </div>
          <div style={lineStyle} />
          <PaymentForm />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CheckoutPage;
