const {Router} = require('express');
const saltylog = require('../saltylog');

const router = Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  saltylog.getOrCreateFighterID('Test Fighter', 'A')
      .then((value) => {
        console.log(value);
        res.json({
          message: value.toString(),
        });
      })
      .catch((error) => {
        if(error.name === 'ValidationError') {
          res.status(422);
        }
        next(error);
      });
});

module.exports = router;
