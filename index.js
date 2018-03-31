const portAudio = require('naudiodon');
const lame = require('lame');
const express = require('express');
const app = express()

// Get input.
const ai = new portAudio.AudioInput({
  channelCount: 2,
  sampleFormat: 16,
  sampleRate: 48000,
  deviceId: 10
});


// Setup LAME MP3 encoder
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

// Pipe encoded MP3 stream
ai.pipe(encoder);
ai.start();

// Express route to get mp3
app.get('/stream.mp3', function (req, res) {
  res.set({
    'Content-Type': 'audio/mpeg3',
    'Transfer-Encoding': 'chunked'
  });
  encoder.pipe(res);
});


// Not needed anymore as not hostin on same server.
app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});


// Listen on port 3000
app.listen(3000, () => {
  console.log(
  'Music Streaming on Port 3000 /stream.mp3'    
  )
})

// Stops stream.
process.once('SIGINT', ai.quit);
