import { Button, Form, Stack, Image } from "react-bootstrap";
import InputField from "./InputField";
import { useUser } from "../contexts/UserProvider";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function Write({ addPost }) {
  const [formErrors, setFormErrors] = useState({});
  const { user } = useUser();
  const postFieldRef = useRef();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    postFieldRef.current.focus();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    const response = await api.post("/posts", {
      text: postFieldRef.current.value,
    });
    if (!response.ok) {
      setFormErrors(response.body.errors.json);
      flash("Unable to post");
      return;
    }
    postFieldRef.current.value = "";
    addPost(response.body);
  };

  return (
    <>
      <Stack gap={3} direction="horizontal" className="Write">
        <Image src={user.avatar_url + "&s=64"} roundedCircle />
        <Form onSubmit={onSubmit}>
          <Stack gap={3} direction="horizontal">
            <InputField
              name="post"
              placeholder="What's in your mind?"
              fieldRef={postFieldRef}
              error={formErrors.text}
            />
            <Button type="submit">Post</Button>
          </Stack>
        </Form>
      </Stack>
      <hr />
    </>
  );
}
export { Write };
