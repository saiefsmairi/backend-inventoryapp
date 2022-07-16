var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Affectation = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "users" },
        zone: { type: Schema.Types.ObjectId, ref: "zones" },
        datedebut: String,
        datefin: String,
        state: String,

    }
);


module.exports = mongoose.model("affectations", Affectation);

