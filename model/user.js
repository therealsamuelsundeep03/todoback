const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  email: String,
  userName: String,
  password: String,
  todo: [{
    task: String,
    createdAt: {
      type: Date,
      // default: Date.now
    }
  }],
},{
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);