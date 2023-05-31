import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const App = () => {
  const clientId = "Abte982yc3oQAxPAHi8kqbD5s-DkbmOtI5WbTgOZaS3Pdo2MuhJwsmHT0oKGbiwlbH2Jiv42L7XFK-vZ";

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      {/* Your app components */}
    </PayPalScriptProvider>
  );
};

export default App;
