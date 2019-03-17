import { ACTIONS } from "../utils/constants";

const initState = {
    data: [],
    loaded: false,
    error: null,
};

export default (state, action) => {
    switch (action.type) {
        case ACTIONS.LOG_FETCH:
            return initState;
        case ACTIONS.LOG_FETCH_ERROR:
            return { data: [], loaded: false, error: error.action };
        case ACTIONS.LOG_FETCH_SUCCESS:
            return { data: action.data, loaded: true, error: null };
        default:
            return state;
    }
}
