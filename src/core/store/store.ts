import { configureStore } from "@reduxjs/toolkit";

import userSliceReducer from "./slices/userSlice";
import backgroundSurveySliceReducer from "./slices/backgroundSurveySlice";
import backgroundAdultSurveySliceReducer from "./slices/backgroundAdultSurveySlice";
import followUpSurveySliceReducer from "./slices/followUpSurveySlice";
import caseListSliceReducer from "./slices/caseListSlice";
import caseListAdultSliceReducer from "./slices/caseListAdultSlice";


export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    backgroundSurvey: backgroundSurveySliceReducer,
    backgroundAdultSurvey: backgroundAdultSurveySliceReducer,
    followUpSurvey: followUpSurveySliceReducer,
    caseListSurvey: caseListSliceReducer,
    caseListAdultSurvey: caseListAdultSliceReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AsyncThunkConfig = {
  state: RootState,
  dispatch: AppDispatch;
};

export default store;
