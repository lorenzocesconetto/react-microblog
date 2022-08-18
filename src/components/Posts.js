import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useApi } from "../contexts/ApiProvider";
import Post from "./Post";
import More from "./More";
import Write from "../components/Write";

export default function Posts({ content, write }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
  const api = useApi();

  let url;
  switch (content) {
    case "feed":
    case undefined:
      url = "/feed";
      break;
    case "explore":
      url = "/posts";
      break;
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      } else {
        setPosts(null);
      }
    })();
  }, [api, url]);

  const loadNextPage = async () => {
    const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp,
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

  const addPost = newPost => {
    setPosts([newPost, ...posts]);
  };

  const renderedPosts = !posts
    ? posts
    : posts.map(post => <Post key={post.id} post={post} />);

  return (
    <>
      {write && <Write addPost={addPost} />}
      {renderedPosts === undefined ? (
        <Spinner animation="border" />
      ) : renderedPosts === null ? (
        <p>Blog posts could not be retrieved</p>
      ) : renderedPosts.length === 0 ? (
        <p>There are no blog posts.</p>
      ) : (
        <>
          {renderedPosts}
          <More pagination={pagination} loadNextPage={loadNextPage} />
        </>
      )}
    </>
  );
}
export { Posts };
