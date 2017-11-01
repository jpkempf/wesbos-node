const mongoose = require('mongoose');
const Store = mongoose.model('Store');

/**
 * HOME PAGE
 */

exports.homePage = (req, res) => {
  res.render('index');
};

/**
 * ADD & EDIT STORES
 */

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.redirect('/');
};
