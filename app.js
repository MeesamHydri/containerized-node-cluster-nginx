const express = require("express");
const app = express();

const appName = process.env.APP_NAME || "app";

app.get("/", (req, res) => {
  res.send(`Pipeline working locally for ${appName} 🚀`);
});

app.listen(3000, () => {
  console.log(`Running ${appName} on port 3000`);
});