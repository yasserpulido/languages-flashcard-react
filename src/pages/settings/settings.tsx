import { useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { useSettings, useUI } from "../../hooks";

const Settings = () => {
  const navigate = useNavigate();
  const { downloadJson, uploadJson } = useSettings();
  const { responseMessage } = useUI();

  return (
    <div className="w-full border-2 rounded-xl border-gray-200 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Settings
        </h1>
      </header>
      <hr className="my-2"/>
      <main>
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
        {responseMessage.show && <p>{responseMessage.message}</p>}
        <p className="text-red-500 text-xs font-bold text-center">
          Uploading will overwrite your current progress
        </p>
      </main>
      <hr className="my-2"/>
      <footer>
        <div className="flex justify-end">
          <Button onClick={() => navigate("/")} color="primary">
            Menu
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
