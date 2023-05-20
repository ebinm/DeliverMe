

const express = require("express")
const app = express();

const PORT = process.env.PORT || 80;


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

