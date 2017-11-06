const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}!`)
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

  const query = { _id: req.params.id };
  const data = req.body;
  const options = {
    new: true,
    runValidators: true,
  };

  const store = await Store
    .findOneAndUpdate(query, data, options)
    .exec();

  req.flash('success', `
    Successfully updated <strong>${store.name}</strong>!
    <a href="/stores/${store.slug}">View store →</a>
  `);
  res.redirect(`/stores/${store._id}/edit`);
};
