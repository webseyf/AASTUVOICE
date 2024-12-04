import React from 'react';
import PropTypes from 'prop-types';
import PostCard from './PostCard'; // Ensure correct path

const PostList = ({ posts }) => {
  return (
    <div className="post-list">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <p>No posts to display.</p>
      )}
    </div>
  );
};

// PropTypes for validating props
PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      content: PropTypes.string,
      imageURL: PropTypes.string,
      author: PropTypes.string,
    })
  ).isRequired,
};

export default PostList;
