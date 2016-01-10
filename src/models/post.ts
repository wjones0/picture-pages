var mongoose = require('mongoose');


var postSchema = mongoose.Schema({

	screenname :String,
    picurl :String,
    date :Date,
    caption: String,
    feature1: String,
    feature2: String,
    feature3: String

});

// -----------   methods ---------------



// create the model and expose it
module.exports = mongoose.model('Post', postSchema);
