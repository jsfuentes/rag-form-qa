import { axios } from "src/api/axios";
import { logAxiosError } from "src/redux/notification";
import { store } from "src/redux/store";

const AuthService = {
  googleLogin,
  onAuth,
  guessMe,
};

export default AuthService;

async function googleLogin(token: string) {
  try {
    const resp = await axios.post<User>("/api/users/google_login", {
      token,
    });
    return resp.data;
  } catch (err: any) {
    store.dispatch(logAxiosError(err, "Creating Google user"));
    throw err;
  }
}

async function guessMe(user: Pick<User, "id" | "type">) {
  try {
    const resp = await axios.post<User>("/api/users/me", { user });
    return resp.data;
  } catch (err: any) {
    store.dispatch(logAxiosError(err, "Fetching user session"));
    throw err;
  }
}

interface OnAuthRequest {
  id: string;
  invite_token?: string;
  default_event?: string;
  route?: string;
  email?: string;
}

// Empty response body expected
interface OnAuthResponse {}

async function onAuth(authParams: OnAuthRequest): Promise<OnAuthResponse> {
  try {
    const resp = await axios.post<OnAuthResponse>("/api/on_auth", {
      ...authParams,
    });

    return resp.data;
  } catch (err: any) {
    store.dispatch(logAxiosError(err, "Preparing to authenticate"));
    throw err;
  }
}
