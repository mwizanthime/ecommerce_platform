// backend/routes/aiSearch.js
const express = require('express');
const DeepSeekService = require('../services/deepseekService');
const { Product, Supplier } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    // Use AI to understand search intent
    const aiResponse = await DeepSeekService.understandQuery(query);
    
    // Convert AI understanding to database query
    const searchCriteria = aiResponse.searchCriteria;
    
    const products = await Product.findAll({
      where: searchCriteria,
      include: [Supplier]
    });

    res.json({
      originalQuery: query,
      interpretedQuery: aiResponse.interpretation,
      results: products
    });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

module.exports = router;