import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  useGetIsAuthed,
  useMutateCreateAcc,
  useMutateLogin,
} from "../hooks/auth";
import "../shared-styles/button.css";

// TODO: ensure that the login functionality works bc i swear when i try to use the same account i created in previous runs
// it will act as if that account doesn't exist?

const LoginPage: React.FC = function () {
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const authQuery = useGetIsAuthed();

  const loginAccountMutation = useMutateLogin();
  const createAccountMutation = useMutateCreateAcc();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestInProgress(true);
    loginAccountMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const tmp = z.string().safeParse(error.response?.data.message);
            if (tmp.success) {
              alert(tmp.data);
            } else {
              alert(`Server Error: ${error.message}`);
              console.error(error);
            }
          }
          setRequestInProgress(false);
        },
      },
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestInProgress(true);
    createAccountMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const tmp = z.string().safeParse(error.response?.data.message);
            if (tmp.success) {
              alert(tmp.data);
            } else {
              alert("Something went wrong.");
              console.error(error);
            }
          }
          setRequestInProgress(false);
        },
      },
    );
  };

  useEffect(() => {
    if (authQuery.status === "success" && authQuery.data) {
      navigate("/account");
    }
  }, [authQuery.status]);

  if (authQuery.isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full md:w-4/5 lg:w:2/3 xl:1/2 flex flex-col items-center">
      <h1 className="text-2xl my-3">
        {isLoginForm
          ? "Login with an existing account"
          : "Create a new account"}
      </h1>

      <form
        className="flex flex-col gap-2 mx-3 border-2 w-1/2 rounded"
        onSubmit={isLoginForm ? handleLogin : handleCreate}
      >
        <div className="border-2 rounded m-3 p-3">
          <label htmlFor="email">Email</label>
          <input
            className="border-2 ml-3"
            type="email"
            name="email"
            id="email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="border-2 rounded m-3 p-3">
          <label htmlFor="password">Password</label>
          <input
            className="border-2 ml-3"
            type="password"
            name="password"
            id="password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isLoginForm && (
          <>
            <button
              type="submit"
              className="button__green"
              disabled={requestInProgress}
            >
              {!requestInProgress ? "Login" : "Logging in..."}
            </button>
            <button
              type="button"
              onClick={() => setIsLoginForm(false)}
              className="bg-slate-200 rounded w-fit mx-auto p-2 mb-2"
            >
              Need to create an account? Click here.
            </button>
          </>
        )}
        {!isLoginForm && (
          <>
            <button
              type="submit"
              className="button__blue"
              disabled={requestInProgress}
            >
              {!requestInProgress ? "Create Account" : "Creating..."}
            </button>
            <button
              type="button"
              onClick={() => setIsLoginForm(true)}
              className="bg-slate-200 rounded w-fit mx-auto p-2 mb-2"
            >
              Have an account already? Click here.
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
