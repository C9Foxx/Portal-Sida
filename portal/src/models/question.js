const {Schema, model} = require("mongoose");

const questionSchema = new Schema ({
    quest: String,
    options: [String],
    ans: String,
});

module.exports = model("question", questionSchema);