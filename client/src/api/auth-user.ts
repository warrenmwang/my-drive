import axios from "axios";
import { AUTH_URL, USER_ACCOUNT_URL } from "../urls";
import { BasicLoginInfo } from "../schema";
import { z } from "zod";

export const apiCreateUser = async function (loginInfo: BasicLoginInfo) {
  return axios
    .post(`${USER_ACCOUNT_URL}`, loginInfo, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
    });
  // .then((data) => z.object({ message: z.string() }).parse(data));
};

export const apiDeleteUser = async function () {
  return axios.delete(`${USER_ACCOUNT_URL}`, {
    withCredentials: true,
  });
};

export const apiLoginUser = async function (loginInfo: BasicLoginInfo) {
  return axios
    .post(`${AUTH_URL}/login`, loginInfo, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .then((data) => z.object({ message: z.string() }).parse(data));
};

export const apiLogoutUser = async function (email: string, password: string) {
  return axios.get(`${AUTH_URL}/logout`, {
    withCredentials: true,
  });
};

export const isAuthed = async function () {
  return axios
    .get(`${AUTH_URL}/status`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    })
    .then((res) => res.data)
    .then((data) => z.boolean(data));
};
