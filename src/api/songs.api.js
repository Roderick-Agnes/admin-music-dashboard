import axios from "axios";
import { ENV, toaster } from "../libs";

export const songsApi = {
  all: async (accessToken, page, size) => {
    // fetch
    const { data } = await axios.get(
      `${ENV.SERVER_URL}/getallsongs?size=${size}&page=${page}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },

  getSongById: async (accessToken, songId) => {
    // fetch
    const { data } = await axios.get(
      `${ENV.SERVER_URL}/getsongbyid/${songId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    if (data.status === 200) {
      return data;
    }

    // change to dashboard page
  },

  deleteById: async (accessToken, songId) => {
    // fetch
    const { data } = await axios.delete(
      `${ENV.SERVER_URL}/deletesong/${songId}`,
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
    const { data } = await axios.put(`${ENV.SERVER_URL}/updatesong`, info, {
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

  // CREATE
  create: async (accessToken, info) => {
    // fetch
    const { data } = await axios.post(`${ENV.SERVER_URL}/createsong`, info, {
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
