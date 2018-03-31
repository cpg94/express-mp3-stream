const portAudio = require('naudiodon');
const lame = require('lame');
const express = require('express');
const path = require('path');
const app = express()

const ai = new portAudio.AudioInput({
  channelCount: 2,
  sampleFormat: 16,
  sampleRate: 48000,
  deviceId: 10
});

const encoder = new lame.Encoder({
    //input
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000,
    // output
    bitRate: 128,
    outSampleRate: 22050,
    mode: lame.STEREO 
});

ai.on('error', console.error);


ai.pipe(encoder);
ai.start();


app.get('/stream.mp3', function (req, res) {
  res.set({
    'Content-Type': 'audio/mpeg3',
    'Transfer-Encoding': 'chunked'
  });
  encoder.pipe(res);
});

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.listen(3000)

process.once('SIGINT', ai.quit);
