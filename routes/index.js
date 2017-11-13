const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeCtrl.getStores));

router.get('/add',
    storeCtrl.addStore
);
router.post('/add',
    storeCtrl.upload,
    catchErrors(storeCtrl.resize),
    catchErrors(storeCtrl.createStore)
);
router.post('/add/:id',
    storeCtrl.upload,
    catchErrors(storeCtrl.resize),
    catchErrors(storeCtrl.updateStore)
);

router.get('/stores',
    catchErrors(storeCtrl.getStores)
);
router.get('/stores/:id/edit',
    catchErrors(storeCtrl.editStore)
);

router.get('/store/:slug',
    catchErrors(storeCtrl.getStoreBySlug)
);

module.exports = router;
