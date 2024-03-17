const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");

const {
  restrictedToLoggedinUserOnly,
  checkAuth,
} = require("./middlewares/auth");
const urlRoute = require("./routes/url");

const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const path = require("path");

const userRoute = require("./routes/user");

const app = express();
const PORT = 3000;

// Connect to the local MongoDB database
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Local MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictedToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
