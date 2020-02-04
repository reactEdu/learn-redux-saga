import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getPosts } from '../modules/posts';
import PostList from '../components/PostList';

const PostListContainer = () => {
  const { data, loading, error }= useSelector(state => state.posts.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // 데이터가 있을때(=뒤로가기로 왔을때) loading 표시 안함
  if(loading && !data) return <div>loading</div>;
  if(error) return <div>error</div>;
  if(!data) return null;

  return <PostList posts={data} />;
};

export default PostListContainer;