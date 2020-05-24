const {Router} = require('express');
const saltylog = require('../saltylog');

const router = Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  try {
    res.json({
      message: saltylog.getCurrentMessage(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
