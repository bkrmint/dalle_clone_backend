import mongoose from "mongoose";

const connectDB = (url) => { 
    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
}

export default connectDB;