
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import router from './Routes/index.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1', router);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
