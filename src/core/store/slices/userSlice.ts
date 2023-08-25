import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchAPI } from "../../api/fetch-api";
import { LoginUserProps, SignUpUserProps } from "../../model/user.model";
import { getStorageValue, setStorageValue } from "../../util/localStorage.util";
import { AsyncThunkConfig } from "../store";

interface UserSlice {
  username: string;
  email: string;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState = {
  username: "",
  email: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: ""
} as UserSlice;

export const signupUser = createAsyncThunk<any, SignUpUserProps, AsyncThunkConfig>(
  "users/signupUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/auth/register",
        method: "POST",
        body: {
          name: username,
          email,
          password,
        },
      });
      const token = response?.headers.get("Authorization");
      if (response?.status === 201) {
        setStorageValue("token", token);
        return { ...data, username, email };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const loginUser = createAsyncThunk<any, LoginUserProps, AsyncThunkConfig>(
  "users/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/auth/login",
        method: "POST",
        body: {
          email,
          password
        }
      });
      const token = response?.headers.get("Authorization");
      if (response?.status === 200) {
        setStorageValue("token", token);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const fetchUserBytoken = createAsyncThunk<any, void, AsyncThunkConfig>(
  'users/fetchUserByToken',
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/auth/me",
        method: "GET"
      });
      if (response?.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.email = payload.email;
        state.username = payload.username;
      })
      .addCase(signupUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(signupUser.rejected, (state, { error }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = error.message || "";
      })

      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.email = payload.email;
        state.username = payload.name;
        state.isFetching = false;
        state.isSuccess = true;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        console.log('error', error);
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = error.message || "";
      })

      .addCase(fetchUserBytoken.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUserBytoken.fulfilled, (state, { payload }) => {
        const token = getStorageValue("token");
        axios.defaults.headers.common['Authorization'] = token;
        state.isFetching = false;
        state.isSuccess = true;

        state.email = payload.email;
        state.username = payload.name;
      })
      .addCase(fetchUserBytoken.rejected, (state) => {
        console.log('fetchUserBytoken');
        state.isFetching = false;
        state.isError = true;
      });
  }
});

export const { clearState } = userSlice.actions;

export default userSlice.reducer;
