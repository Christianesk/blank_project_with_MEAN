var User = require('../models/user');

const searchController = [];




/**
* Author: Christian Mena
* Description: Search by collection
**/
searchController.findByCollection = (req, res) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');
    var table = req.params.table;

    var promise;

    switch (table) {
        case 'users':
            promise = findUsers(search, regex);
            break;
        case 'option1':
            /* Write your code here */
            break;
        case 'option2':
            /* Write your code here */
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'The type of searches are only: user and others',
                error: { message: 'type of collection invalid' }
            });
    }

    promise.then(data =>{
        res.status(200).json({
            ok: true,
            [table]: data
        });
    });

};

/**
* Author: Christian Mena
* Description: General Search
**/
searchController.findAllCollections = (req, res) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([findUsers(search, regex)]) //Use it like that:  Promise.all([findUsers(search, regex),findOption1(search, regex),findOption2(search, regex)])
        .then(response => {
            res.status(200).json({
                ok: true,
                users: response[0]
            });
        });
};


function findUsers(search, regex) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email role img')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, user) => {
                if (err) {
                    reject('Error loading users', err)
                } else {
                    resolve(user);
                }
            });
    });

}

/* Write your code here  the options*/


module.exports = searchController;