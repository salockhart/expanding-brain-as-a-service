const Jimp = require('jimp');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

const port = (process.env.PORT || 3000);
app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(path.join(__dirname, '/docs')));

function brainImage(first, second, third, fourth) {
  return Promise.all([
    Jimp.read('input.jpg'),
    Jimp.loadFont(Jimp.FONT_SANS_16_BLACK),
  ]).then((data) => {
    const [loadedImage, font] = data;
    return new Promise((resolve, reject) => {
      loadedImage
        .print(font, 10, (157.25 * 0) + 10, first)
        .print(font, 10, (157.25 * 1) + 10, second)
        .print(font, 10, (157.25 * 2) + 10, third)
        .print(font, 10, (157.25 * 3) + 10, fourth)
        .getBuffer(Jimp.AUTO, (err, buffer) => {
          if (err) {
            return reject(err);
          }
          return resolve(buffer);
        });
    });
  }).catch((err) => {
    console.error(err);
  });
}

app.get('/brain', (req, res) => {
  const {
    first,
    second,
    third,
    fourth,
  } = req.query;

  return brainImage(first, second, third, fourth)
    .then((imageBuffer) => {
      res.write(imageBuffer);
      res.end();
    });
});

app.post('/slack', (req, res) => {
  if (req.body.token !== process.env.SLACK_VERIFY_TOKEN) {
    return res.sendStatus(400);
  }

  if (!req.body.text || req.body.text === 'help') {
    return res.send({
      response_type: 'ephemeral',
      text: 'How to use /brain',
      attachments: [{
        text: 'To ascend to a higher plane, use `/brain "first brain" "second brain" "third brain" "fourth brain"`',
      }],
    });
  }

  req.body.text = req.body.text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

  console.log('requesting', req.body.text);

  const [first, second, third, fourth] = req.body.text.split('"').filter(entry => !!entry.trim());

  return res.send({
    response_type: 'in_channel',
    attachments: [{
      image_url: `https://expanding-brain-as-a-service.herokuapp.com/brain?first=${first || ''}&second=${second || ''}&third=${third || ''}&fourth=${fourth || ''}`,
    }],
  });
});

app.get('/slack/redirect', (req, res) => {
  const options = {
    uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
    method: 'GET',
  };

  request(options, (error, response, body) => {
    const JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      res.redirect('http://alexlockhart.ca/expanding-brain-as-a-service/slack/install/?error');
    } else {
      res.redirect('http://alexlockhart.ca/expanding-brain-as-a-service/slack/install/?success');
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
