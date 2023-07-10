const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Member = require('./models/Member');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/gym', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

const users = [
  { username: 'admin', password: 'password' },
  { username: 'user', password: '123456' },
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/members', async (req, res) => {
  const { name, email, phoneNumber, membershipType } = req.body;
  const newMember = new Member({
    name,
    email,
    phoneNumber,
    membershipType,
  });
  try {
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});