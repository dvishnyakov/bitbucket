var mongoose = require('./lib/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createArticles,
    createComment
], function(err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');
    require('./models/article');
    require('./models/comment');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {username: 'lennon', password: '123'},
        {username: 'mccartney', password: '123'},
        {username: 'harrison', password: '123'},
        {username: 'starr', password: '123'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createArticles(callback) {
    var articles = [
        { uid: 1, username: 'lennon', title: 'Article (grammar)', text: 'An article (abbreviated art) is a word (or prefix or suffix) that is used with a noun to indicate the type of reference being made by the noun. Articles specify grammatical definiteness of the noun, in some languages extending to volume or numerical scope. The articles in the English language are the and a/an, and (in certain contexts) some. \'An\' and \'a\' are modern forms of the Old English \'an\', which in Anglian dialects was the number \'one\' (compare \'on\', in Saxon dialects) and survived into Modern Scots as the number \'owan\'. Both \'on\' (respelled \'one\' by the Normans) and \'an\' survived into Modern English, with \'one\' used as the number and \'an\' (\'a\', before nouns that begin with a consonant sound) as an indefinite article.'},
        { uid: 2, username: 'lennon', title: 'Romney Literary Society', text: 'The Romney Literary Society (also known as the Literary Society of Romney) existed from January 30, 1819, to February 15, 1886, in Romney, West Virginia. Established as the Polemic Society of Romney, it became the first organization of its kind in the present-day state of West Virginia, and one of the first in the United States. The society was founded by nine prominent men of Romney with the objectives of advancing literature and science, purchasing and maintaining a library, and improving educational opportunities.'},
        { uid: 3, username: 'lennon', title: 'AlphaGo', text: 'AlphaGo is a computer program developed by Google DeepMind that plays the board game Go. In October 2015, it became the the first computer Go program to beat a professional human Go player in an even match on a full-sized 19×19 board.'},
        { uid: 4, username: 'lennon', title: 'January 2016 East Asia cold wave', text: 'In late January 2016, a cold wave struck much of East Asia and parts of mainland Southeast Asia, bringing record cold temperatures and snowfall to many regions. Many regions saw their coldest temperatures in decades, while sleet was reported in Okinawa for the first time on record. Snowfall and frigid weather stranded thousands of people across four countries. At least 85 people in Taiwan died from hypothermia and cardiac arrest following a sudden drop in temperature during the weekend of January 22–24. The cold claimed a further four lives in China, and fourteen in Thailand, and snowstorms resulted in six deaths across Japan.'},
        { uid: 5, username: 'mccartney', title: 'Zika virus', text: 'Zika virus (ZIKV) is a member of the Flaviviridae virus family and the Flavivirus genus, transmitted by daytime-active Aedes mosquitoes, such as A. aegypti.'},
        { uid: 6, username: 'mccartney', title: 'Theory of relativity', text: 'The theory of relativity, or simply relativity in physics, usually encompasses two theories by Albert Einstein: special relativity and general relativity. Concepts introduced by the theories of relativity include spacetime as a unified entity of space and time, relativity of simultaneity, kinematic and gravitational time dilation, and length contraction.'},
        { uid: 7, username: 'mccartney', title: 'Dorothea Warren O\'Hara', text: 'Dorothea Warren O\'Hara (August 31, 1873 - May 1972) was an American ceramic artist who won the Lifetime Membership Prize from the National Arts Club and a gold medal at the Panama–Pacific International Exposition. She was president of the Keramic Society of Greater New York and president of the New York National Society of Craftsmen.'}
    ];

    async.each(articles, function(articleData, callback) {
        var article = new mongoose.models.Article(articleData);
        article.save(callback);
    }, callback);
}

function createComment(callback) {

    var comments = [
        { username: 'lennon', articleUID: 5, text: 'comment 01' },
        { username: 'lennon', articleUID: 6, text: 'comment 02' },
        { username: 'mccartney', articleUID: 3, text: 'comment 03' },
        { username: 'mccartney', articleUID: 4, text: 'comment 04' }
    ];

    async.each(comments, function(commentData, callback) {
        var comment = new mongoose.models.Comment(commentData);
        comment.save(callback);
    }, callback);
}