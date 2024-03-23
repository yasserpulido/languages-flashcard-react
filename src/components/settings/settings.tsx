import { forwardRef } from "react";

import { Modal } from "../modal";
import { ModalMethods } from "../../types";
import { useDictionary } from "../../hooks";
import { Button } from "../button";

const Settings = forwardRef<ModalMethods>((_, ref) => {
  const { downloadJson, uploadJson, responseMessage } = useDictionary();

  return (
    <Modal ref={ref}>
      <h1 className="text-2xl font-bold text-gray-800 text-center">Settings</h1>
      <hr className="my-4" />
      <p className="text-gray-800 text-center">
        Download and upload your progress data
      </p>
      <div className="flex gap-4 justify-center my-4">
        <Button
          onClick={() => {
            downloadJson();
          }}
          color="secondary"
        >
          Download
        </Button>
        <Button
          onClick={() => {
            uploadJson();
          }}
          color="secondary"
        >
          Upload
        </Button>
      </div>
      {responseMessage.show && (
        <div className="my-2">
          <small>{responseMessage.message}</small>
        </div>
      )}
      <div className="my-2">
        <small>
          <strong className="text-red-500">Warning:</strong> Uploading will
          overwrite your current progress
        </small>
      </div>
      <hr />
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            if (ref && "current" in ref && ref.current) {
              ref.current.close();
            }
          }}
          color="primary"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
});

export default Settings;
