const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors());

const db = require('./models');

const logRouter = require('./routes/Logs');
app.use("/logs", logRouter);
const targetRouter = require('./routes/Targets');
app.use("/targets", targetRouter);
const userRouter = require('./routes/Users');
app.use("/users", userRouter);

db.sequelize.sync().then(() => app.listen(3001));