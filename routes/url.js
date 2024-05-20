// routes/url.js
const express = require('express');
const router = express.Router();
const Url = require('../models/url');

// @route POST /api/url/shorten
// @desc Create short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  if (!originalUrl) {
    return res.status(400).json('Invalid URL');
  }

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      res.json(url);
    } else {
      const shortUrl = baseUrl + '/' + shortid.generate();
      url = new Url({ originalUrl, shortUrl });
      await url.save();
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// @route GET /:code
// @desc Redirect to the original URL
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: `${process.env.BASE_URL}/${req.params.code}` });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
