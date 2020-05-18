const express = require('express');
const saltylog = require('./saltylog');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.json({
      message: 'api response',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
