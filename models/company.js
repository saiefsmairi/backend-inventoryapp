var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Company = new Schema(
    {
        name: String,
        adress: String,
        email: {
            type: "string",
            trim: true,
            unique: true,
        },
        pays: String,
        codepostal: String,
        employees: [
            {
                employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],

    }
);


module.exports = mongoose.model("companies", Company);
