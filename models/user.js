var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

var User = new Schema(
    {
        firstName: String,
        lastName: String,
        email: {
            type: "string",
            trim: true,
            unique: true,
        },
        password: String,
        phone: Number,
        role: [String],

        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        image: {
            type: String,
            default: "",
        },
        resetpassword: String,
        accepted: {
            type: Boolean,
            default: false,
        },

    }
);


module.exports = mongoose.model("users", User);
