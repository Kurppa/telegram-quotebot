const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.json({ message: "heloost"})
})

const PORT = process.env.PORT || 4000

let server = app.listen(PORT, "0.0.0.0", () => {
  const HOST = server.address().address;
  const PORT = server.address().port;
  console.log(`Web server started at http://${HOST}:${PORT}`);
});

module.exports = (bot) => {
  app.post('/', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
