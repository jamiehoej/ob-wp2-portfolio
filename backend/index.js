import express from "express";

// create the express app
const app = express();
const PORT = 3000;

// routes
app.get("/", (request, response) => {
  response.send("hi");
});

// start server
app.listen(PORT, () => {
  console.log(`started server on: http://localhost:${PORT}`);
});
