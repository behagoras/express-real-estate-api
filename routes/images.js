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

    // multer local files
    const storage = multer.diskStorage({
        destination: './uploads/',
        filename: function (req, file, cb) {
            // Mimetype stores the file type, set extensions according to filetype
            switch (file.mimetype) {
            case 'image/jpeg':
                ext = '.jpeg';
                break;
            case 'image/png':
                ext = '.png';
                break;
            case 'image/gif':
                ext = '.gif';
                break;
            }

            cb(null, file.originalname.slice(0, 4) + Date.now() + ext);
        }
    });
    const upload = multer({storage: storage});

    // Post image to local files
    router.post(
        '/local',
        upload.single('file'),
        async function(req, res, next) {
            if (req.file && req.file.originalname) {
                console.log(`Received file ${req.file.originalname}`);
                console.log(req.file);
                }
                try {
                // const createdPropertyUid = await propertiesService.createProperty({ property });
                res.status(201).json({
                    responseText: req.file.path,
                    message: 'POST image'
                });
                } catch (err) {
                next(err);
                }
        }
    );

    //post image to GCP
    router.post(
        '/', 
        uploadGcpHandler.any(), 
        // eslint-disable-next-line no-unused-vars
        async function (req, res, next) {
            // eslint-disable-next-line no-console
            console.log(req.files);
            res.status(201).json({
                data:req.files,
                message: 'image created'
            });
        }
    );
}






module.exports = propertiesApi;





