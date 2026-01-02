const express = require('express');
const app = express();
const loginmodel = require('./model/user')
const busTypemodel = require('./model/busType')
const cors=require("cors")
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./Connection/DBConnection");
const busmodel = require('./model/bus');
const routesmodel = require('./model/routes');
const scheduleModel = require('./model/schedule')
const bookingModel = require('./model/booking')
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

app.listen(3005, () => {
  console.log('✅ Server is listening on http://localhost:3005');
});

app.get('/', (request, response) => {
  response.send('Server is running!');
});

app.post('/new', (request, response) => {
  request.body.role = 'User';

  const newRecord = new loginmodel(request.body);

  // Save the record to the database
  newRecord.save()
    .then(() => {
      response.send('Records saved successfully');
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Error saving the record');
    });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginmodel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    console.log(user)

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/view', async (request, response) => {
  try {
    const users = await loginmodel.find();
    response.status(200).json({
      message: 'Success',
      users
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// DELETE a user by ID
app.put('/removeUser/:id', async (req, res) => {
  try {
    const updatedUser = await loginmodel.findByIdAndUpdate(req.params.id, { status:'Inactive' }, { new: true });
    res.status(200).json({ message: 'User deleted successfully', updatedUser });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

app.put('/updateUser/:id', async (req, res) => {
  try {
    const updatedUser = await loginmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

app.get('/bus-types', async (request, response) => {
  try {
    const busTypes = await busTypemodel.find();
    response.status(200).json({
      message: 'Success',
      busTypes
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

app.post('/add-bus-type', (request, response) => {

  const newRecord = new busTypemodel(request.body);

  // Save the record to the database
  newRecord.save()
    .then(() => {
      response.send('Records saved successfully');
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Error saving the record');
    });
});

// DELETE a bus type by ID
app.put('/remove-bus-type/:id', async (req, res) => {
  try {
    const updatedBusType = await busTypemodel.findByIdAndUpdate(req.params.id, { status:'Inactive' }, { new: true });
    res.status(200).json({ message: 'bus type updated successfully', updatedBusType });
  } catch (err) {
    console.error('Error updating bus type:', err);
    res.status(500).json({ message: 'Error updating bus type' });
  }
});

const uploadPath = path.join(process.cwd(), "upload");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("Uploads folder created at:", uploadPath);
} else {
  console.log("Uploads folder exists:", uploadPath);
}

// ---------------------------
// Multer Storage Config
// ---------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ---------------------------
// Serve upload folder publicly
// ---------------------------
// app.use("/upload", express.static(uploadPath));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ---------------------------
// UPDATE Bus Type API (as you have)
// ---------------------------
app.put('/update-bus-type/:id', async (req, res) => {
  try {
    const updatedBusType = await busTypemodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: 'Bus type updated successfully',
      updatedBusType,
    });

  } catch (err) {
    console.error('Error updating bus type:', err);
    return res.status(500).json({
      message: 'Error updating bus type'
    });
  }
});


// ---------------------------
// FILE UPLOAD ENDPOINT
// ---------------------------
app.post("/upload-bus-image", upload.single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.status(200).json({
    message: "Image uploaded successfully",
    fileName: req.file.filename,
    filePath: `/upload/${req.file.filename}`,
  });
});


// ======================================================
// GET ALL BUSES
// ======================================================
app.get('/buses', async (request, response) => {
  try {
    const buses = await busmodel.find();
    response.status(200).json({
      message: 'Success',
      buses
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});


// ======================================================
// ADD BUS (WITH IMAGE)
// ======================================================
app.post('/add-bus', upload.single("image"), (request, response) => {
  const newRecord = new busmodel({
    ...request.body,
    image: request.file ? request.file.filename : null
  });

  newRecord.save()
    .then(() => {
      response.send('Bus added successfully');
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Error saving the bus');
    });
});


// ======================================================
// REMOVE (INACTIVATE) BUS
// ======================================================
app.put('/remove-bus/:id', async (req, res) => {
  try {
    const updatedBus = await busmodel.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );
    res.status(200).json({ message: 'Bus updated successfully', updatedBus });
  } catch (err) {
    console.error('Error updating bus:', err);
    res.status(500).json({ message: 'Error updating bus' });
  }
});


// ======================================================
// UPDATE BUS (WITH OPTIONAL IMAGE UPDATE)
// ======================================================
app.put('/update-bus/:id', upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Only update image if a new one is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedBus = await busmodel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: "Bus updated successfully", updatedBus });

  } catch (err) {
    console.error("Error updating bus:", err);
    res.status(500).json({ message: "Error updating bus" });
  }
});

app.get('/routes', async (request, response) => {
  try {
    const routes = await routesmodel.find();
    response.status(200).json({
      message: 'Success',
      routes
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

app.post('/add-route', (request, response) => {

  const newRecord = new routesmodel(request.body);

  // Save the record to the database
  newRecord.save()
    .then(() => {
      response.send('Records saved successfully');
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Error saving the record');
    });
});

// DELETE a route by ID
app.put('/remove-route/:id', async (req, res) => {
  try {
    const updatedRoute = await routesmodel.findByIdAndUpdate(req.params.id, { status:'Inactive' }, { new: true });
    res.status(200).json({ message: 'Route updated successfully', updatedRoute });
  } catch (err) {
    console.error('Error updating route:', err);
    res.status(500).json({ message: 'Error updating route' });
  }
});

app.put('/update-route/:id', async (req, res) => {
  try {
    const updatedRoute = await routesmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Route updated successfully', updatedRoute });
  } catch (err) {
    console.error('Error updating route:', err);
    res.status(500).json({ message: 'Error updating route' });
  }
});

app.get('/schedules', async (req, res) => {
  try {
    const schedules = await scheduleModel.find()
      .populate("busId")
      .populate("routeId");

    res.status(200).json({
      message: 'Success',
      schedules
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/add-schedule', async (req, res) => {
  try {
    const newSchedule = new scheduleModel(req.body);

    await newSchedule.save();
    res.status(200).send('Schedule saved successfully');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving schedule');
  }
});


app.put('/update-schedule/:id', async (req, res) => {
  try {
    const updatedSchedule = await scheduleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: 'Schedule updated successfully',
      updatedSchedule
    });

  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule' });
  }
});


app.put('/remove-schedule/:id', async (req, res) => {
  try {
    const deletedSchedule = await scheduleModel.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );

    res.status(200).json({
      message: 'Schedule marked as inactive',
      deletedSchedule
    });

  } catch (error) {
    console.error('Error removing schedule:', error);
    res.status(500).json({ message: 'Error removing schedule' });
  }
});
app.get("/search-buses", async (req, res) => {
  try {
    const { from, to } = req.query;

    // 1. Find route
    const route = await routesmodel.findOne({
      sourceLocation: from,
      destinationLocation: to,
      status: "Active",
    });

    if (!route) {
      return res.status(404).json({ message: "No route found" });
    }

    // 2. Find schedules for route
    const schedules = await scheduleModel
      .find({
        routeId: route._id,
        status: "Active",
      })
      .populate("busId") // get bus details
      .populate("routeId");

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
});

app.get("/bus/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    const schedule = await scheduleModel.findOne({ busId, status: "Active" })
      .populate("busId")
      .populate("routeId");
    if (!schedule) return res.status(404).json({ message: "Bus not found" });
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bus details" });
  }
});

// Save booking (after payment)
app.post("/book-seat", async (req, res) => {
  try {
    const { userId, busId, routeId, seats, fare,journeyDate } = req.body;

    const newBooking = new bookingModel({
      userId,
      busId,
      routeId,
      seats,
      fare,
      journeyDate,
      status: "Confirmed",
    });

    await newBooking.save();
    res.status(200).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving booking" });
  }
});
app.get("/bookings/bus/:busId", async (req, res) => {
  try {
   const { busId } = req.params;
    const { date } = req.query; // 👈 journey date from frontend

    if (!date) {
      return res.status(400).json({ message: "Journey date is required" });
    }

    const bookings = await bookingModel.find({
      busId: busId,
      journeyDate: date, // 👈 filter by date
      // status: "Confirmed"
    });
    // collect all booked seats
    const bookedSeats = bookings.flatMap(b => b.seats);

    res.json(bookedSeats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booked seats" });
  }
});
// GET ALL BOOKINGS – ADMIN
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .populate("busId", "name vehicleNo")
      .populate("routeId", "sourceLocation destinationLocation")
      .populate("userId", "name email")
      // .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});




