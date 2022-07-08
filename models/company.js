var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Company = new Schema(
    {
        companyname: String,
        companyadress: String,
        city: String,
        country: String,
        postalcode: String,
        AdminCompany: { type: Schema.Types.ObjectId, ref: "users" },
        employees: [
            {
                employee: { type: Schema.Types.ObjectId, ref: "users" },
            },
        ],

    }
);


module.exports = mongoose.model("companies", Company);
