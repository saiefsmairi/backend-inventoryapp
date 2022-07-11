var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Area = new Schema(
    {
        name: String,
        code: String,
        zones: [
            {
                zone: { type: Schema.Types.ObjectId, ref: "zones" },
            },
        ],
    }
);


module.exports = mongoose.model("areas", Area);

