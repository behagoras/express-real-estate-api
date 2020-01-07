const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require("multer-google-storage");

function propertiesApi(app) {

    const router = express.Router();
    app.use('/api/images', router);

    //upload to gcp using .env variables
    const uploadGcpHandler = multer({
        storage: multerGoogleStorage.storageEngine()
    });

    //post image to GCP
    router.post(
        '/', 
        uploadGcpHandler.any(), 
        // eslint-disable-next-line no-unused-vars
        function (req, res, next) {
            // eslint-disable-next-line no-console
            try {
                // res.setHeader('Access-Control-Allow-Origin', '*')
                // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                // res.setHeader(
                //     'Access-Control-Allow-Headers',
                //     'Authorization, Accept, Content-Type'
                //     )
                res.setHeader("cache-control", "s-maxage=63072000 maxage63072000");

                console.log(req.files);
                res.status(201).json({
                    data:req.files,
                    message: 'image created'
                });
            } catch (error) {
                res.json(error);
            }

            // res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
        }
    );
}






module.exports = propertiesApi;





