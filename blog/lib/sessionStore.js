var mongoose = require('mongoose');
var express = require('express');
var MongoStore = require('connect-mongo/es5')(express);

var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

module.exports = sessionStore;