const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

const PORT = 5000;

app.use(cors());

function generateString() {
  const array = [];
  
  const randomTasksCount = Math.floor(10 + Math.random() * (15 - 10));
  
  while(array.length < randomTasksCount){
    const r = Math.floor(Math.random()*20) + 1;
    if(array.indexOf(r) === -1) array.push(r);
  }
  
  const rundomNumbersString = array.join(',');
  
  return rundomNumbersString;
}

app.get('/random-data', async (req, res) => {
  const result = await axios.get(`http://libgen.io/json.php?ids=${generateString()}&fields=Title`);
  res.send(JSON.stringify(result.data))
});


app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
