import React from "react";
import Drive from "../Drive";
import FileUploader from "../FileUploader/FileUploader";

const HomePage: React.FC = function () {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold">My Drive</h1>
      <img src="/favicon.png"/>
      <FileUploader />
      <Drive />
    </div>
  );
};

export default HomePage;
