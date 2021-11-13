require("dotenv").config();

const express = require("express");
const session = require("express-session");
const userRouter = require("./routes/users");
const companyRouter = require("./routes/company");
const jobRouter = require("./routes/jobs");
const timeRouter = require("./routes/time");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET, POST, DELETE, PUT"],
  })
);

app.use("/user", userRouter);

app.use("/company", companyRouter);

app.use("/jobs", jobRouter);

app.use("/time", timeRouter);

app.get("/healthcheck", (req, res) => {
  return res.status(200);
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3001");
});

module.exports = app;
