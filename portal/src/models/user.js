const {Schema, model} = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema ({
    supUs: {
        type: Boolean,
        default: false
    },
    name: String,
    bDay: String,
    email: {
        type: String,
        unique: true,
    },
    pass: String,
    scores: [Number]
});

userSchema.methods.encryptPassword = async (pass) =>{
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(pass,salt);
}

userSchema.methods.validatePassword = async function(pass){
    return bcrypt.compare(pass, this.pass);
}

module.exports = model("user", userSchema);