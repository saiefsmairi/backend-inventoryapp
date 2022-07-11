var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Zone = new Schema(
    {
        name: String,
        code: String,

    }
);


module.exports = mongoose.model("zones", Zone);

