var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Notification = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "users" },
        receiver: { type: Schema.Types.ObjectId, ref: "users" },
        text: String,
        zone: { type: Schema.Types.ObjectId, ref: "zones" },
    }
);


module.exports = mongoose.model("notifications", Notification);

