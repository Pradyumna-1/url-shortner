// const express = require("express");
// const { connectToMongoDB } = require("./connect");
// const urlRoute = require("./routes/url");
// const URL = require("./models/url");

// const app = express();
// const PORT = 8001;

// connectToMongoDB(
//   "mongodb+srv://pradyumnakumarnaik1:MAPLEhATy664174B@cluster0.bwcnfjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// ).then(() => console.log("Mongodb connected"));

// app.use(express.json());

// app.use("/url", urlRoute);

// app.get("/:shortId", async (req, res) => {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     {
//       shortId,
//     },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         },
//       },
//     }
//   );
//   res.redirect(entry.redirectURL);
// });

// app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 3000;

// Connect to the local MongoDB database
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Local MongoDB connected"))
  .catch((err) => console.error("Local MongoDB connection error:", err));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
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
