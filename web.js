const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

var server = app.listen(process.env.PORT, "0.0.0.0", () => {
  const HOST = server.address().address;
  const PORT = server.address().port;
  console.log(`Web server started at http://${HOST}:${PORT}`);
});

module.exports = (bot) => {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};