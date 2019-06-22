const initialState = {
    loggedIn: false,
    scoreFirst: 0,
    scoreSecond: 0,
    scoreThird: 0,
    scoreFourth: 0
};

const rootReducer = (state = initialState, action) => {
    if(action.type === "ONLOGIN") {
        return {
            ...state,
            loggedIn: true
        };
    }
    if(action.type === "ONLOGOUT") {
        return {
            loggedIn: false,
            scoreFirst: 0,
            scoreSecond: 0,
            scoreThird: 0,
            scoreFourth: 0
        };
    }
    if(action.type === "UPDATEFIRST") {
        if(state.scoreFirst > action.val) {
            return state;
        }
        return {
            ...state,
            scoreFirst: action.val
        }
    }
    if(action.type === "UPDATESECOND") {
        if(state.scoreSecond > action.val) {
            return state;
        }
        return {
            ...state,
            scoreSecond: action.val
        }
    }
    if(action.type === "UPDATETHIRD") {
        if(state.scoreThird > action.val) {
            return state;
        }
        return {
            ...state,
            scoreThird: action.val
        }
    }
    if(action.type === "UPDATEFOURTH") {
        if(state.scoreFourth > action.val) {
            return state;
        }
        return {
            ...state,
            scoreFourth: action.val
        }
    }
    return state;
}

export default rootReducer;