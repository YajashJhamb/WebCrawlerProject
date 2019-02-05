import { ADD_URL } from "../actions/types";

const initialState = {
  URL: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_URL:
      return {
        ...state,
        URL: [action.payload, ...state.URL]
      };
    default:
      return state;
  }
}
