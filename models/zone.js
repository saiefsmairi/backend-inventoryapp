var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Zone = new Schema(
    {
        name: String,
        code: String,
        area: { type: Schema.Types.ObjectId, ref: "areas" },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "products" },
            },
        ],
    }
);


module.exports = mongoose.model("zones", Zone);

