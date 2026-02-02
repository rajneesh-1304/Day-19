import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { deleteUserr, fetchUsers, loginUser, registerUser } from "./service";
import { deleteUser } from "firebase/auth";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface UserState {
  users: any[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchAll',
  async (
    { page, limit }: any,
    { rejectWithValue }
  ) => {
    try {
      return await fetchUsers({ page, limit, });
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch questions');
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await loginUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'auth/delete',
  async (id: any, { rejectWithValue })=> {
    try {
      return await deleteUserr(id);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
)


const usersSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    clearUsers: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        const { user, page } = action.payload;
        if(page === '1'){
          state.users=user;
        }else{
          state.users = [...state.users, ...user];
        }
        state.loading = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
        // state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        // state.loading = false;
        state.error = String(action.payload) || "Login failed";
      });

  },
});

export const { logout, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
