const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'Unsupported file type'}, false);
    }
  }
};

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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if(!req.file) {
    next();
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}!`)
  res.redirect(`/store/${store.slug}`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  
  if (!store) {
    return next();
  }

  res.render('store', { store, title: store.name });
}

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

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const [
    tags,
    stores
  ] = await Promise.all([
    Store.getTagsList(),
    Store.find({ tags: tag || { $exists: true } })
  ]);

  res.render('tags', { tag, tags, stores, title: 'Tags' });
};
