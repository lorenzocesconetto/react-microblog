import { Body } from "../components";
import { Button, Form } from "react-bootstrap";
import { InputField } from "../components";
import { useEffect, useRef, useState } from "react";
import { useApi, useFlash } from "../contexts";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const oldPasswordFieldRef = useRef();
  const newPasswordFieldRef = useRef();
  const newPassword2FieldRef = useRef();
  const [formErrors, setFormErrors] = useState({});
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    oldPasswordFieldRef.current.focus();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    if (
      newPasswordFieldRef.current.value !== newPassword2FieldRef.current.value
    ) {
      setFormErrors({ password2: "Passwords don't match" });
      return;
    }
    const response = await api.put("/me", {
      old_password: oldPasswordFieldRef.current.value,
      password: newPasswordFieldRef.current.value,
    });
    if (!response.ok) {
      setFormErrors(response.body.errors.json);
      flash("Unable to set new password", "danger");
      return;
    }
    setFormErrors({});
    flash("New password saved", "success");
    navigate("/");
  };

  return (
    <Body sidebar>
      <h1>Change your password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="currentPassword"
          label="Old password"
          type="password"
          error={formErrors.old_password}
          fieldRef={oldPasswordFieldRef}
        />
        <InputField
          name="newPassword"
          label="New password"
          type="password"
          error={formErrors.password}
          fieldRef={newPasswordFieldRef}
        />
        <InputField
          name="newPassword2"
          label="Confirm new password"
          type="password"
          error={formErrors.password2}
          fieldRef={newPassword2FieldRef}
        />
        <Button type="submit">Change password</Button>
      </Form>
    </Body>
  );
}

export { ChangePasswordPage };
