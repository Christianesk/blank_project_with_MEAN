const fileUpload = require('express-fileupload');
var fs = require('fs');
var User = require('../models/user');

var express = require('express');

const uploadController = [];

var app = express();

// default options
app.use(fileUpload());



uploadController.loadFile = (req, res, next) => {
    

    var type = req.params.type;
    var id = req.params.id;


    //types of collection
    var typesValid = ['users']; // Write here your types valid example : ['option 1', 'option 2', 'users']

    if (typesValid.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Type of collection is not valid',
            errors: { message: 'Type of collection is not valid' }
        });
    }



    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Did not select anything',
            errors: { message: 'You must select an image' }
        });
    }

    //get the file name
    var file = req.files.image;
    var nameCut = file.name.split('.');
    var extensionFile = nameCut[nameCut.length - 1];

    //Extensions accepted
    var extensionsValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionsValid.indexOf(extensionFile) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid Extension',
            errors: { message: 'extensions are not valid ' + extensionsValid.join(', ') }
        });
    }

    //Custom File Name
    var fileName = `${id}-${new Date().getMilliseconds()}.${extensionFile}`;

    //Move the file to an path
    var path = `./uploads/${type}/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error moving file',
                errors: err
            });
        }

        uploadByType(type, id, fileName, res);
    });
}

function uploadByType(type, id, fileName, res) {

    if (type === 'users') {
        User.findById(id, (err, user) => {

            if (!user) {
                res.status(400).json({
                    ok: true,
                    message: 'User does not exist',
                    errors:{message: 'User does not exist'}
                });
            }


            var pathOld = './uploads/users/' + user.img;

            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            user.img = fileName;

            return user.save((err, userUpdated) => {

                userUpdated.password = ':)';

                res.status(200).json({
                    ok: true,
                    message: 'Updated User Image',
                    user: userUpdated
                });
            });

        });
    }

    /* Write your code here about the options*/
}



module.exports = uploadController;