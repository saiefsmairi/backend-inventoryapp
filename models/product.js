var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Product = new Schema(
    {
        name: String,
        code: String,
        quantity: String,
        price: String,
        zone: { type: Schema.Types.ObjectId, ref: "zones" },
    }
);


module.exports = mongoose.model("products", Product);

