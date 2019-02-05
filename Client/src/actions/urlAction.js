import { ADD_URL } from "./types";

export const addURL = res => {
  return {
    type: ADD_URL,
    payload: res
  };
};
