var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProductsFromFile = new Schema(
    {
        code: { type: String, unique: false, required: true },
        name: String,
        uniteprice: String,
    }
);

module.exports = mongoose.model("productsFromFile", ProductsFromFile);
