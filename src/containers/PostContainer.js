import React from 'react';
import Post from '../components/Post';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getPost, clearPost, goToHome } from '../modules/posts';
import { reducerUtils } from './../lib/asyncUtils';

const PostContainer = ({ postId }) => {
  const { data, loading, error } = useSelector(
    state => state.posts.post[postId] || reducerUtils.initial() // 처음 로드시 에러 막기위해 초기 데이터를 적용
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if(data) return; // 데이터가 있으면 다시 데이터 불러오지 않음
    dispatch(getPost(postId));
  }, [postId, dispatch]);
  
  if(loading && !data) return <div>loading</div>; // 데이터가 있으면 loading중을 표시하지 않음
  if(error) return <div>error</div>;
  if(!data) return null;

  return (
    <>
      <button onClick={() => dispatch(goToHome())}>Home</button>
      <Post post={data} />
    </>
  );
};

export default PostContainer;