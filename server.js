import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-reservations";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Destructure what we need from mongoose
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  guestName: {
    type: String,
    required: true,
    minlength: 4,
  },
  guestPhone: {
    type: String,
    required: true,
    minlength: 10,
  },
  date: {
    type: Date,
    required: true,
  },
  partySize: {
    type: Number,
    min: 1,
    max: 10,
  },
});

// The model
const Reservation = model("Reservation", reservationSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Post reservation
app.post("/reservations", async (req, res) => {
  // destructure what we need from the body
  const { guestName, guestPhone, date, partySize } = req.body;

  try {
    // Success case - create reservation
    const reservation = await new Reservation({
      // write what info we should pass to this new instance in the database
      guestName,
      guestPhone,
      date,
      partySize,
      // save the reservation
    }).save();

    // Set success status
    res.status(201).json({
      success: true,
      response: reservation,
      message: "Reservation created successfully",
    });
  } catch (error) {
    // Failed case / bad request
    res.status(400).json({
      success: false,
      response: error,
      message: "Reservation couldn't be made",
    });
  }
});

console.log(new Date())

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
