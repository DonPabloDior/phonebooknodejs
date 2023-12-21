let xlsx =require("xlsx")
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.get('/jsonData', (req, res) => {
    let wb = xlsx.readFile('БазаОСАстана.xlsx');
    let ws = wb.Sheets['База ОС'];
    let data = xlsx.utils.sheet_to_json(ws);
  
    let filteredData = data.filter(item => item['Тип'] === 'Внутренний номер');
    let filteredMore = filteredData.filter(item => item['Фирма'] === 'VIAMEDIS');
  
    // Create an array to store the filtered results
    let resultsArray = [];
    let result = {}
    filteredMore.forEach(item => {
      let result = {
        'Фирма': item['Фирма'],
        'Наименование': item['Наименование'],
        'Тип': item['Тип'],
        'Ответственный': item['Ответственный'],
      };
      resultsArray.push(result);
    });
  
    // Convert the array to JSON
    const jsonData = JSON.stringify(resultsArray, null, 2);
  
    // Send the JSON data as the API response
    res.json({ resultsArray });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

