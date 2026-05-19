const path = require("path");

module.exports = {
  mode: "production",
  entry: "./main.js",   // change if your entry is different
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  target: "node"
};