const {Router} = require('express');
const saltylog = require('../saltylog');

const router = Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const fighters = saltylog.getCurrentFighters();
  res.json({
    message: `[${fighters[0]}, ${fighters[1]}]`,
  });
});

module.exports = router;
