var checkAuth = require('../middleware/checkAuth');
var url = require('url');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);

    app.get('/chat', function(req, res) {
        res.render('../templates/chat');
    });

    app.get('/login', require('./login').get);
    app.post('/authorize', require('./authorize').post);

    app.post('/logout', require('./logout').post);

    app.get('/join', require('./join').get);
    app.post('/register', require('./register').post);

    app.get('/profile/:username', require('./profile').get);
    app.post('/profile', checkAuth, require('./profile').post);
    app.put('/profile', checkAuth, require('./profile').put);
    app.delete('/profile', checkAuth, require('./profile').delete);

    app.post('/articles', require('./article').find);
    app.post('/articles/byusername', require('./article').getArticlesByUsername);

    app.get('/article/:username/new', require('./article').get);
    app.get('/article/:username/:uid', require('./article').get);

    app.post('/articleobj/:username/:uid', require('./article').postobj);
    app.get('/articleobj/:username/:uid', require('./article').getobj);
    app.put('/articleobj/:username/:uid', require('./article').putobj);
    app.delete('/articleobj/:username/:uid', require('./article').deleteobj);

    app.get('/commentlist/:articleuid', require('./comment').getAll);
    app.post('/comment/:articleuid', require('./comment').post);

    /*app.get('/user/:id', function(req, res, next) {
        try {
            var id = new ObjectID(req.params.id);
        } catch (e) {
            return next(404);
        }


        User.findById(req.params.id, function(err, user) {
            if (err) return next(err);
            if (!user) {
                next(404);
            }
            res.json(user);
        });
    });*/

};