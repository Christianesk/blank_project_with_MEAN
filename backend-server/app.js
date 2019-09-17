//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const URL_FRONTEND = require('./config/config').URL_FRONTEND;



//Variable Initialization

var app = express();
app.use(cors({origin:URL_FRONTEND}));
const PORT_SERVER = 3000;

//BodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

//Import Routes
var appRoutes = require('./routes/app.routes');
var userRoutes = require('./routes/user.routes');
var loginRoutes = require('./routes/login.routes');
var searchRoutes = require('./routes/search.routes');
var uploadRoutes = require('./routes/upload.routes');
var imagesRoutes = require('./routes/images.routes');



//Database Connection
mongoose.connection.openUri(
    'mongodb://localhost:27017/systemDB',
    {
        useCreateIndex: true,
        useNewUrlParser: true
    }, 
    (err, res) => {
        if (err) throw err;

        console.log(`Database:\x1b[32m online\x1b[0m `);
    });




//Creating Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img',imagesRoutes);
app.use('/', appRoutes);





//Listen to requests
app.listen(PORT_SERVER, () => {
    console.log(`express server running in port ${PORT_SERVER} \x1b[32m online\x1b[0m `);
});
