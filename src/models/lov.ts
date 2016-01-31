var mongoose = require('mongoose');


var lovSchema = mongoose.Schema({

    lovName: String,
    depValue :String,
    values :[String]

});

// -----------   methods ---------------



// create the model and expose it
module.exports = mongoose.model('LOV', lovSchema);
