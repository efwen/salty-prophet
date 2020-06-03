const {Router} = require('express');
const saltyLog = require('../saltylog');
const router = Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const state = saltyLog.getState();
  res.json(state);
});

module.exports = router;
