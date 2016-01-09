var Post = require('../models/post');
import {Router} from 'express';

const posts = Router();

/* GET posts listing. */
posts.get('/', function(req, res, next) {
    Post.find(function(err, postData) {
        if(err)
            res.send(err);
            
        res.json(postData);
    });
});

posts.post('/', function(req,res,next) {
   
   let newPost = new Post();
   
   newPost.screenname = req.body.screenname;
   newPost.picurl = req.body.picurl;
   newPost.date = req.body.date;
   newPost.feature1 = req.body.feature1;
   newPost.feature2 = req.body.feature2;
   newPost.feature3 = req.body.feature3;
   
   newPost.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Post created' });
        }); 
});



export default posts;
