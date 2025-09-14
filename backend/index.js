const express = require('express');
const app = express();
const loginmodel = require('./model/user')
const cors=require("cors")
const mongoose = require('mongoose');

const db = require("./Connection/DBConnection")
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

    // Optional: You can send back role, name, etc.
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    // console.log(res,'reeeeee')
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/view', async (request, response) => {
  try {
    const users = await loginmodel.find();

    // Not needed: if (!users) check — because users will be [] if none found

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
app.delete('/removeUser/:id', async (req, res) => {
  try {
    await loginmodel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
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





