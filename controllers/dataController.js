const { fetchData } = require('../utils/alphaVantage');
const Asset = require('../models/Assets');

const storeAssetData = async (req, res) => {
    const { symbol, assetType } = req.body;
  
    try {
      const data = await fetchData(symbol);
  
      // Check if the API response contains data
      if (data && data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const records = Object.entries(timeSeries).map(([date, values]) => ({
          date: new Date(date),
          symbol,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          adjusted_close: parseFloat(values['5. adjusted close']),
          volume: parseInt(values['6. volume']),
          asset_type: assetType,
        }));
  
        // Insert into MongoDB
        await Asset.insertMany(records);
        res.status(201).json({ message: `Data for ${symbol} stored successfully.` });
        console.log('API Response:', data);

      } else {
        res.status(404).json({ message: `No data found for ${symbol}.` });
        console.log('API Response:', data);
      }
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  };
  

module.exports = { storeAssetData };
