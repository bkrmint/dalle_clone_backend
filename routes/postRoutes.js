import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('...cloudinary', cloudinary.config().cloud_name);
console.log('...cloudinary', cloudinary.config().api_key);
console.log('...cloudinary', cloudinary.config().api_secret);

// router.route('/').get((req, res) => {
//     res.send('Hello from postRoutes!');
// });

// Get all posts
router.route('/').get( async(req, res) => {
    console.log('...get all posts');
    try{
        const posts = await Post.find({});
        res.status(200).json({success: true, data: posts});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }

});


// Create a post
router.route('/').post( async(req, res) => {
   try {
    const { name, prompt, photo } = req.body;
    console.log('...form', name, prompt);
    // const photoUrl = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==").then(result => console.log(result)).catch(error => console.log(error));
    // console.log('...photoUrl', photoUrl.url);

    let photoUrl = '';
    // promises dont get asigned to a variable.. it is better use then and catch and then access the results from with scoped variables
    await cloudinary.uploader.upload(photo)
    .then(result => {
        console.log("Success", JSON.stringify(result, null, 2));
        photoUrl = result.url;
    })
    .catch(error => {
        console.log("Failure", JSON.stringify(error, null, 2));
    });

    const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl,
    });

    res.status(201).json({success: true, data: newPost});
   } catch (error) {
        console.log(error);
         res.status(500).json({success: false, message: error});
    }
});

export default router;
