const express = require('express');
const app = express();
const loginmodel = require('./model/user')
const busTypemodel = require('./model/busType')
const cors=require("cors")
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");

const db = require("./Connection/DBConnection");
const busmodel = require('./model/bus');
const routesmodel = require('./model/routes');
const scheduleModel = require('./model/schedule')
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(3005, () => {
  console.log('✅ Server is listening on http://localhost:3005');
});

app.get('/', (request, response) => {
  response.send('Server is running!');
});

app.post('/new', (request, response) => {
  request.body.role = 'User';
  console.log(request.body)

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

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
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

app.put('/update-bus-type/:id', async (req, res) => {
  try {
    const updatedBusType = await busTypemodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'bus type updated successfully', updatedBusType });
  } catch (err) {
    console.error('Error updating bus type:', err);
    res.status(500).json({ message: 'Error updating bus type' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

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






