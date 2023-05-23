const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    }
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = {
    Customer
}