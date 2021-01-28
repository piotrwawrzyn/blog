const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const commentId = randomBytes(4).toString('hex');

  const comments = commentsByPostId[postId] || [];

  const newComment = { id: commentId, content, status: 'pending' };
  comments.push(newComment);

  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId
    }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Event received', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find(c => c.id === id);
    comment.status = status;

    console.log('Emiting event "Comment Updated"');

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId }
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Running on port 4001');
});
