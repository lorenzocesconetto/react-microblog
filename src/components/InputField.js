import { Form } from "react-bootstrap";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  error,
  fieldRef,
}) {
  return (
    <Form.Group className="my-4" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || "text"}
        placeholder={placeholder}
        ref={fieldRef}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}
export { InputField };
