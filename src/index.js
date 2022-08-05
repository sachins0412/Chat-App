const express = require("express");
const app = express();

const path = require("path");

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public/views");
app.use(express.static(publicPath));
// app.get("/", (req, res) => {
//   res.render("index.html");
// });

app.listen(port, () => {
  console.log("server is running on port ", port);
});
