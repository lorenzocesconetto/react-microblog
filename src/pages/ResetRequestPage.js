import { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Body, InputField } from "../components";
import { useApi, useFlash } from "../contexts";

export default function ResetRequestPage() {
  const [formErrors, setFormErrors] = useState({});
  const emailField = useRef();
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    emailField.current.focus();
  }, []);

  const onSubmit = async event => {
    event.preventDefault();
    const response = await api.post("/tokens/reset", {
      email: emailField.current.value,
    });
    if (!response.ok) {
      setFormErrors(response.body.errors.json);
    } else {
      emailField.current.value = "";
      setFormErrors({});
      flash(
        "You will receive an email with instructions " +
          "to reset your password.",
        "info"
      );
      navigate("/login");
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email Address"
          error={formErrors.email}
          fieldRef={emailField}
        />
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
    </Body>
  );
}

export { ResetRequestPage };
