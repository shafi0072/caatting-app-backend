require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// routers 
const authRouters = require('./Router/Authentication/auth')
const friends = require('./Router/friend/findFriend')
const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRouters)
app.use('/friend', friends)
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("db connected"))
.catch((err) => console.log("db connection error:", err));

app.listen(process.env.PORT || 5050, () => {
  console.log('listening on port ' + process.env.PORT || 5050);
})

