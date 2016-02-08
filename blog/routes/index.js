var checkAuth = require('../middleware/checkAuth');
var url = require('url');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);
    app.post('/authorize', require('./authorize').post);

    app.post('/logout', require('./logout').post);

    app.get('/join', require('./join').get);
    app.post('/register', require('./register').post);

    app.post('/profile', checkAuth, require('./profile').post);
    app.get('/profile/:username', require('./profile').get);
    app.put('/profile', checkAuth, require('./profile').put);
    app.delete('/profile', checkAuth, require('./profile').delete);

    app.post('/articles', require('./article').find);
    app.post('/articles/byusername', require('./article').getArticlesByUsername);

    app.get('/article/:username/new', checkAuth, require('./article').get);
    app.get('/article/:username/:uid', require('./article').get);

    app.post('/articleobj/:username/:uid', checkAuth, require('./article').postobj);
    app.get('/articleobj/:username/:uid', require('./article').getobj);
    app.put('/articleobj/:username/:uid', checkAuth, require('./article').putobj);
    app.delete('/articleobj/:username/:uid', checkAuth, require('./article').deleteobj);

    app.get('/commentlist/:articleuid', require('./comment').getAll);
    app.post('/comment/:articleuid', checkAuth, require('./comment').post);
};