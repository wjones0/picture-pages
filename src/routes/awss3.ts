import {Router} from 'express';
var xssFilters = require('xss-filters');
var aws = require('aws-sdk');
var randomstring = require("randomstring");


// local file config
import * as appAuthConfig from '../../config/config';
// process environment variable config
// import * as appAuthConfig from './appconfig/config';

const configs : appAuthConfig.AuthConfigSecrets = new appAuthConfig.AuthConfigSecrets();

const awss3 = Router();

/* GET posts listing. */
awss3.post('/getAWSS3URL', function(req,res,next) {
    
    var filename = getNewFileName(req.body.name);
    
    aws.config.update({accessKeyId: configs.amazon.access_key, secretAccessKey: configs.amazon.secret_key});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: configs.amazon.bucket,
        Key: filename,
        ContentType: req.body.type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+configs.amazon.bucket+'.s3.amazonaws.com/'+filename
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});


function getNewFileName(name :string) {
    var x = name.split('.');
        
    return randomstring.generate() + `.${x[x.length-1]}`;
}

export default awss3;
