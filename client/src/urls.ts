import { FILE_ORIGIN, USER_AUTH_ORIGIN } from "./config";

export const SESSION_START_URL = `${FILE_ORIGIN}/session/start`;
export const SESSION_END_URL = `${FILE_ORIGIN}/session/end`;
export const UPLOAD_SINGLE_URL = `${FILE_ORIGIN}/upload/single`;
export const UPLOAD_MULTIPART_INIT_URL = `${FILE_ORIGIN}/upload/multipart/init`;
export const UPLOAD_MULTIPART_CHUNK_URL = `${FILE_ORIGIN}/upload/multipart/chunk`;

export const RETRIEVE_FILE_METADATA_LIST = `${FILE_ORIGIN}/retrieve/list`;
export const RETRIEVE_FILE_URL = `${FILE_ORIGIN}/retrieve`;

export const AUTH_URL = `${USER_AUTH_ORIGIN}/auth/v1`;
export const USER_ACCOUNT_URL = `${USER_AUTH_ORIGIN}/user/v1`;
