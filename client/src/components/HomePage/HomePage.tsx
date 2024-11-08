import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = function () {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold">Document Import Tool</h1>
      <p>
        Think of this as a personal Google Drive, where you can upload new files
        and download your previouly uploaded files.
      </p>

      <p>
        If you're just getting started, navigate to the{" "}
        <Link to="/login">Login</Link> page and create an account.
      </p>
      <p>
        If you've been here before, you can try to see if you're still logged in
        by navigating to the <Link to="/drive">Drive</Link> page. If you're not
        seeing that, then you are not logged in.
      </p>
    </div>
  );
};

export default HomePage;
