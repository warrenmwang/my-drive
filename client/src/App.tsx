import Drive from "./components/Drive";
import FileUploader from "./components/FileUploader/FileUploader";
import AccountLoginOrCreate from "./components/AccountLoginOrCreate";
import { useGetIsAuthed } from "./hooks/auth";
import AccountSection from "./components/AccountSection";

function App() {
  let isAuthed = false;
  const authed = useGetIsAuthed();
  if (authed.isSuccess) {
    isAuthed = authed.data;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold">My Drive</h1>
      <img src="/favicon.png" />
      {isAuthed && (
        <>
          <AccountSection />
          <FileUploader />
          <Drive />
        </>
      )}
      {!isAuthed && <AccountLoginOrCreate />}
    </div>
  );
}

export default App;
