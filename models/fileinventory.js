var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FileInventory = new Schema(
    {
        filename: String,
        company: { type: Schema.Types.ObjectId, ref: "company" },
        productsFromFile: [
            {
                products: { type: Schema.Types.ObjectId, ref: "productsFromFile" },
            },
        ],

    }
);

module.exports = mongoose.model("fileInventory", FileInventory);
