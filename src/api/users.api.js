import axios from "axios";
import { ENV, toaster } from "../libs";

export const usersApi = {
  all: async (accessToken, page, size) => {
    // fetch
    const { data } = await axios.get(
      `${ENV.SERVER_URL}/getallusers?size=${size}&page=${page}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    // show message
    // toaster(data.message);

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },

  getUserById: async (accessToken, userId) => {
    // fetch
    const { data } = await axios.get(
      `${ENV.SERVER_URL}/getuserbyid/${userId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    // show message
    // toaster(data.message);

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },

  create: async (accessToken, info) => {
    // fetch
    const { data } = await axios.post(`${ENV.SERVER_URL}/register`, info, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    // show message
    toaster(data.message);

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },

  deleteById: async (accessToken, userId) => {
    // fetch
    const { data } = await axios.delete(
      `${ENV.SERVER_URL}/deleteuser/${userId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    // show message
    toaster(data.message);

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },
  updateById: async (accessToken, info) => {
    // fetch
    const { data } = await axios.put(`${ENV.SERVER_URL}/updateuser`, info, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    // show message
    toaster(data.message);

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },
};
