import { useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { useSettings, useUI } from "../../hooks";
import { useEffect } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const { downloadJson, uploadJson } = useSettings();
  const { responseMessage, resetResponseMessage } = useUI();

  useEffect(() => {
    resetResponseMessage();
  }, [resetResponseMessage]);

  return (
    <div className="w-full border-2 rounded-xl border-gray-200 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Settings
        </h1>
      </header>
      <hr className="my-2" />
      <main className="flex flex-col justify-center items-center gap-2">
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
        <p className="text-red-500 text-xs font-bold text-center">
          Uploading will overwrite your current progress
        </p>
      </main>
      <hr className="my-2" />
      <footer className="flex justify-between items-center">
        <small
          className={`${
            responseMessage.type === "error" ? "text-red-500" : "text-green-500"
          } text-center`}
        >
          {responseMessage.show && responseMessage.message}
        </small>
        <Button onClick={() => navigate("/")} color="primary">
          Menu
        </Button>
      </footer>
    </div>
  );
};

export default Settings;
