import { useContext } from "react";
import { Alert, Collapse } from "react-bootstrap";
import { FlashContext } from "../contexts/FlashProvider";

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);

  return (
    <Collapse in={visible}>
      <div>
        <Alert
          variant={flashMessage.variant}
          dismissible
          onClose={hideFlash}
          data-testid="flash-alert-message"
          data-visible={visible}
        >
          {flashMessage.message}
        </Alert>
      </div>
    </Collapse>
  );
}
export { FlashMessage };
