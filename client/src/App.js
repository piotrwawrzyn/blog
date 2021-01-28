import React, { Component } from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Create post</h1>
        <PostCreate />
        <hr />
        <h1>Posts</h1>
        <PostList />
      </div>
    );
  }
}

export default App;
