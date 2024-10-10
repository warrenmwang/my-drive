import * as React from "react";
import FileUploader from "./FileUploader/FileUploader";

const WizardForm: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-fit mt-3 p-3 border-2 rounded shadow-md">
        <h1 className="text-xl font-mono text-center underline">Wizard Form</h1>

        <h1>Mass File Uploader</h1>
        <FileUploader />
      </div>
    </div>
  );
};

export default WizardForm;
