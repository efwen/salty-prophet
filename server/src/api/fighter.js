const {Router} = require('express');
const saltylog = require('../saltylog');

const router = Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  try {
    saltylog.getFighter(1).then((value) => {
      const row = value.rows[0];
      res.json({
        message: row['name'],
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
