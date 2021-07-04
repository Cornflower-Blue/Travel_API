const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const axios = require('axios');
const PORT = 3001 || process.env.PORT;

app.use(express.static('public'));
app.use(express.json());

let options = {
  url: `https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/city-directions`,
  headers: {
    'x-access-token': dotenv.parsed.TOKEN,
    'x-rapidapi-key': dotenv.parsed.APIKEY,
  }
};

app.get('/tickets:params', (req, res) => {
  const { params } = req.params;
  console.log(options.headers, params, `${options.url}?origin=${params}&currency=USD`);
  axios.get(`${options.url}?origin=${params}&currency=USD`, {headers: options.headers})
    .then( (tickets) => {
      console.log('info: ', tickets.data.data);
      res.send(tickets.data.data)
    })
    .catch( (err) => console.log('read error: ', err.response.data));
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})