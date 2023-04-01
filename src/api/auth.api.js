import axios from "axios";
import { ENV, toaster } from "../libs";
import { setLoading, setUserInfo } from "../reducer";

export const authApi = {
  login: async (dispatch, history, email, password) => {
    const data = await axios.post(`${ENV.SERVER_URL}/login`, {
      email,
      password,
    });

    if (Object.keys(data.data.data).length > 0) {
      console.log("data: ", data.data.data);
      dispatch(setUserInfo(data.data.data));
      history.push("/dashboard");
    }

    // loading hidden
    dispatch(setLoading(false));

    // change to dashboard page

    // show message
    toaster(data.data.message);
  },
};
