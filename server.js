import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
const port = process.env.PORT || 3000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message, heart } = req.body;
  const thought = new Thought({ message, heart });
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: "Could not post message", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
