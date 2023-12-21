const xlsx = require('xlsx');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');
app.use(cors());

app.get('/jsonData', async (req, res) => {
  try {
    // Assuming the Excel file is hosted on a server, replace the URL with the actual URL
    const excelFileUrl = 'https://doc.prots.kz/sip/viamedis/phonebook/БазаОСАстана.xlsx';

    // Fetch the Excel file using axios
    const response = await axios.get(excelFileUrl, { responseType: 'arraybuffer' });

    // Parse the Excel file content
    const wb = xlsx.read(response.data, { type: 'buffer' });
    const ws = wb.Sheets['База ОС'];
    const data = xlsx.utils.sheet_to_json(ws);

    let filteredData = data.filter(item => item['Тип'] === 'Внутренний номер');
    let filteredMore = filteredData.filter(item => item['Фирма'] === 'VIAMEDIS');

    // Create an array to store the filtered results
    let resultsArray = [];
    let result = {};
    filteredMore.forEach(item => {
      let result = {
        'Город': item['Город'],
        'Фирма': item['Фирма'],
        'Отделение': item['Отделение'],
        'Тип': item['Тип'],
        'Ответственный': item['Ответственный'],
      };
      resultsArray.push(result);
    });

    // Convert the array to JSON
    const jsonData = JSON.stringify(resultsArray, null, 2);
    const filePath = '/sip/viamedis/phonebook/БазаОСАстана.json';
    fs.writeFileSync(filePath, jsonData);
    // Send the JSON data as the API response
    res.json({ resultsArray });
  } catch (error) {
    console.error('Error fetching or processing the Excel file:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
