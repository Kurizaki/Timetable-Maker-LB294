// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let schedules = {};

app.post('/api/schedule', (req, res) => {
  const scheduleId = generateScheduleId();
  const newSchedule = req.body;
  schedules[scheduleId] = newSchedule;
  res.json({ scheduleId });
});

app.get('/api/schedule/:id', (req, res) => {
  const scheduleId = req.params.id;
  const schedule = schedules[scheduleId];
  
  if (schedule) {
    res.json(schedule);
  } else {
    res.status(404).json({ error: 'Schedule not found' });
  }
});

function generateScheduleId() {
  return Math.random().toString(36).substring(7);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
