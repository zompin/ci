import { ACTIONS } from "../utils/constants";

const logFetch = () => ({
  type: ACTIONS.LOG_FETCH,
});

const logFetchError = error => ({
  type: ACTIONS.LOG_FETCH_ERROR,
  error,
});

const logFetchSuccess = data => ({
  type: ACTIONS.LOG_FETCH_SUCCESS,
  data,
});

export default () => (dispatch) => {
  dispatch(logFetch());

  fetch('/ci.log')
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      return response.text();
    })
    .then(data => dispatch(logFetchSuccess(data)))
    .catch(error => dispatch(logFetchError(error)));
};
