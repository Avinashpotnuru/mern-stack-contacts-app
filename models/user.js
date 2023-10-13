const mongoose = require("mongoose");

const ContactNumbers = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 3;
      },
      message: "Name must be at least 3 characters long",
    },
  },
  number: {
    type: String,
    required: true,
    unique: true,

    validator: function (value) {
      return value.length >= 10;
    },
    message: "Name must be at least 10 characters long",
  },
});

module.exports = mongoose.model("phone_numbers", ContactNumbers);
