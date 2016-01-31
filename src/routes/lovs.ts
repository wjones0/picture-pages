var Lov = require('../models/lov');
import {Router} from 'express';
var xssFilters = require('xss-filters');

const lovs = Router();


/* GET posts listing. */
lovs.get('/', function(req, res, next) {
    Lov.find({})
        .exec(function(err, postData) {
            if (err) {
                res.send(err);
            }

            res.json(postData);
        });
});



// create a new feature
lovs.post('/', function(req, res, next) {

    // check to see if we have this level one feature
    Lov.find({lovName: { $eq: xssFilters.inHTMLData(req.body.lovName) } })
        .exec(function(err, lovData) {
            if (err) {
                res.send(err);
            }

            // we do have it - add LOV values to it
            if (lovData.length > 0) {
                console.log('Adding to existing LOV');

                let lovToEdit = lovData[0];
                lovToEdit.values.push(...req.body.values);

                lovToEdit.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'LOV edited' });
                });

            // we don't have it - add totally new LOV
            } else {
                console.log('Totally New LOV');
                let newLov = new Lov();
                newLov.lovName = xssFilters.inHTMLData(req.body.lovName);
                newLov.depValue = xssFilters.inHTMLData(req.body.depValue);
                newLov.values = req.body.values;

                newLov.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'LOV created' });
                });

            }

        });

});



export default lovs;
