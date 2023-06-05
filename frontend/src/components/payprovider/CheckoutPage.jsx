import React from 'react';
import PaymentForm from './PaymentForm';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const containerStyle = {
  height: '70vh', // Set the height to 70% of the viewport height
  width: '50vw', // Set the width to 50% of the viewport width
  display: 'flex',
  margin: '0 auto',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const lineStyle = {
  borderBottom: '1px solid #E2E8F0',
  width: '80%', // Specify the desired width for the line
  marginBottom: '10px',
};

const textStyle = {
  marginLeft: '10px', // Add left margin to the text
};

const contentStyle = {
  marginLeft: '40px', // Add left margin to the content
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

export default function CheckoutPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" sx={{ mb: 4 }}>
      
        <Paper variant="outlined" sx={{ ...containerStyle }}>
          
        <div style={textStyle}>
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
          <React.Fragment>
            <PaymentForm />
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
