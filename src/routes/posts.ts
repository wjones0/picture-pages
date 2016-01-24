var Post = require('../models/post');
import {Router} from 'express';
var xssFilters = require('xss-filters');

const posts = Router();

/* GET posts listing. */
posts.get('/', function(req, res, next) {
    Post.find(function(err, postData) {
        if (err) {
            res.send(err);
        }

        res.json(postData);
    });
});

posts.post('/', function(req, res, next) {

   let newPost = new Post();

   newPost.screenname = xssFilters.inHTMLData(req.body.screenname);
   newPost.caption = xssFilters.inHTMLData(req.body.caption);
   newPost.picurl = xssFilters.inHTMLData(encodeURI(req.body.picurl));
   newPost.date = xssFilters.inHTMLData(req.body.date);
   newPost.feature1 = xssFilters.inHTMLData(req.body.feature1);
   newPost.feature2 = xssFilters.inHTMLData(req.body.feature2);
   newPost.feature3 = xssFilters.inHTMLData(req.body.feature3);

   newPost.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Post created' });
        });
});



export default posts;
