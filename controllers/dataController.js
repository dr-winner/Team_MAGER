const { fetchData } = require('../utils/alphaVantage');
const Asset = require('../models/Assets');
const axios = require('axios');

const storeAssetData = async (req, res) => {
    const { symbol, assetType } = req.body;
  
    try {
      const data = await fetchData(symbol);
  
      if (data && data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const records = Object.entries(timeSeries)
          .map(([date, values]) => ({
            date: new Date(date),
            symbol,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            adjusted_close: parseFloat(values['5. adjusted close'] || 0),
            volume: parseInt(values['6. volume'] || 0),
            asset_type: assetType,
          }))
          .filter((record) => record.adjusted_close > 0 && record.volume > 0); // Filter invalid data
  
        if (records.length > 0) {
          await Asset.insertMany(records);
          res.status(201).json(records);
        } else {
          res.status(404).json({ message: `No valid data found for ${symbol}.` });
        }
      } else {
        res.status(404).json({ message: `No data found for ${symbol}.` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

/**
 * Search for stock symbols using Alpha Vantage's SYMBOL_SEARCH endpoint.
 * @param {Request} req - Express request object (expects `keyword` as a query parameter).
 * @param {Response} res - Express response object.
 */
const searchSymbols = async (req, res) => {
  const { keyword } = req.query; // Extract keyword from query parameters
  const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  const BASE_URL = "https://www.alphavantage.co/query";

  // Validate the keyword
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ message: "Keyword is required for searching symbols." });
  }

  try {
    // Fetch matching symbols from Alpha Vantage
    const response = await axios.get(BASE_URL, {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: keyword,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const matches = response.data.bestMatches;

    if (matches && matches.length > 0) {
      // Format the results for better usability
      const formattedResults = matches.map((match) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
        timezone: match['7. timezone'],
      }));

      return res.status(200).json(formattedResults);
    } else {
      return res.status(404).json({ message: "No matching symbols found." });
    }
  } catch (error) {
    console.error("Error fetching symbols:", error.message);
    return res.status(500).json({ message: "An error occurred while searching for symbols." });
  }
};


module.exports = { storeAssetData, searchSymbols };
