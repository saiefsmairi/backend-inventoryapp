var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Affectation = new Schema(
    {
        employee: { type: Schema.Types.ObjectId, ref: "users" },
        zone: { type: Schema.Types.ObjectId, ref: "zones" },
        company: { type: Schema.Types.ObjectId, ref: "companies" },

        Datedebut: String,
        Datefin: String,
        state: String,

    }
);


module.exports = mongoose.model("affectations", Affectation);

