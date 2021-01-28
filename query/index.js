const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (data, type) => {
  console.log('Handling: ', data, type);
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  } else if (type === 'CommentCreated') {
    console.log('Adding comment...');

    const { id, content, status, postId } = data;

    console.log('Adding comment: ', content, status, id);

    posts[postId].comments.push({ id, content, status });
  } else if (type === 'CommentUpdated') {
    console.log('Updating comment....');
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(c => c.id === id);
    comment.status = status;
    comment.content = content;

    console.log('Updated comment: ', content, status, id);
  }
};

app.get('/getposts', (req, res) => {
  console.log('Sending posts...');
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);
  const { type, data } = req.body;

  handleEvent(data, type);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  const res = await axios.get('http://event-bus-srv:4005/events');
  const events = res.data;

  for (let event of events) {
    handleEvent(event.data, event.type);
  }
});
