import { useNavigate, useParams } from "react-router-dom";
import Body from "../components/Body";
import { useEffect, useState } from "react";
import { Spinner, Stack, Image, Button } from "react-bootstrap";
import { useApi } from "../contexts/ApiProvider";
import TimeAgo from "../components/TimeAgo";
import Posts from "../components/Posts";
import { useUser } from "../contexts/UserProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState();
  const { user: loggedInUser } = useUser();
  const [isFollower, setIsFollower] = useState();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    (async () => {
      const response = await api.get(`/users/${username}`);
      if (response.ok) {
        setUser(response.body);
        if (username === loggedInUser.username) {
          setIsFollower(null);
        } else {
          const isFollowerResponse = await api.get(
            `/me/following/${response.body.id}`
          );
          if (isFollowerResponse.status === 204) {
            setIsFollower(true);
          } else if (isFollowerResponse.status === 404) {
            setIsFollower(false);
          }
        }
      } else {
        setUser(null);
      }
    })();
  }, [username, api, loggedInUser.username]);

  const onEdit = () => {
    navigate("/edit");
  };

  const onFollow = async () => {
    const response = await api.post(`/me/following/${user.id}`);
    if (!response.ok) {
      return;
    }
    flash(
      <>
        You are now following <b>{username}</b>
      </>,
      "success"
    );
    setIsFollower(true);
  };

  const onUnfollow = async () => {
    const response = await api.delete(`/me/following/${user.id}`);
    if (!response.ok) {
      return;
    }
    flash(
      <>
        You have unfollowed <b>{username}</b>
      </>,
      "info"
    );
    setIsFollower(false);
  };

  return (
    <Body sidebar>
      {user === undefined ? (
        <Spinner animation="border" />
      ) : user === null ? (
        <p>Could not retrieve data from server.</p>
      ) : (
        <>
          <Stack direction="horizontal" gap={4}>
            <Image src={user.avatar_url + "&s=128"} roundedCircle />
            <div>
              <h1>{user.username}</h1>
              {user.about_me && <h5>{user.about_me}</h5>}
              <p>
                Member since: <TimeAgo isoDate={user.first_seen} />
              </p>
              <p>
                Last seen: <TimeAgo isoDate={user.last_seen} />
              </p>
              {isFollower === null ? (
                <Button variant="primary" onClick={onEdit}>
                  Edit
                </Button>
              ) : isFollower ? (
                <Button variant="outline-primary" onClick={onUnfollow}>
                  Unfollow
                </Button>
              ) : (
                <Button variant="primary" onClick={onFollow}>
                  Follow
                </Button>
              )}
            </div>
          </Stack>
          <Posts content={user.id} />
        </>
      )}
    </Body>
  );
}

export { UserPage };
