import { Body, InputField } from "../components";
import { Button, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useApi, useUser, useFlash } from "../contexts";
import { useNavigate } from "react-router-dom";

export default function EditUserPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const emailFieldRef = useRef();
  const aboutMeFieldRef = useRef();
  const api = useApi();
  const { user, setUser } = useUser();
  const flash = useFlash();
  const navigate = useNavigate();
  // const [hasModifications, setHasModifications] = useState(false);

  useEffect(() => {
    usernameFieldRef.current.focus();
    usernameFieldRef.current.value = user.username;
    emailFieldRef.current.value = user.email;
    aboutMeFieldRef.current.value = user.about_me ?? "";
  }, [user]);

  const onSubmit = async event => {
    event.preventDefault();
    const response = await api.put("/me", {
      username: usernameFieldRef.current.value,
      email: emailFieldRef.current.value,
      about_me: aboutMeFieldRef.current.value,
    });
    if (!response.ok) {
      setFormErrors(response.body.errors.json);
      return;
    }
    setFormErrors({});
    setUser(response.body);
    flash("Your profile was updated", "success");
    navigate(`/user/${response.body.username}`);
  };

  return (
    <Body sidebar>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="email"
          label="Email"
          error={formErrors.email}
          fieldRef={emailFieldRef}
        />
        <InputField
          name="aboutMe"
          label="About me"
          error={formErrors.aboutMe}
          fieldRef={aboutMeFieldRef}
        />
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </Body>
  );
}

export { EditUserPage };
