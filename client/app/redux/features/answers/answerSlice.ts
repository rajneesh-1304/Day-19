import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createAnswer, fetchAnswers, getAnswerId } from "./answerService";

export interface User {
  id: number;
  displayName: string;
}

export interface Question {
  id: number;
}

export interface Answer {
  id: number;
  answer: string;
  createdAt: string;
  updatedAt:string;
  questionId: Question
  userId: string;
  upVote: number;
  downVote:number;
  isValid: false;
}

interface AnswersState {
  answers: any[];
  currentAnswer: Answer | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnswersState = {
  answers: [],
  currentAnswer: null,
  loading: false,
  error: null,
};

export const fetchAnswerThunk = createAsyncThunk(
  "answers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAnswers();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch questions");
    }
  }
);

export const createAnswerThunk = createAsyncThunk(
  "answer/create",
  async (answerData, { rejectWithValue }) => {
    try {
      return await createAnswer(answerData);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
);

export const getAnswerById = createAsyncThunk(
  "answer/getbyId",
  async (id: string, { rejectWithValue })=>{
    try {
      return await getAnswerId(id);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
)

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    clearAnswers: (state) => {
      state.answers= [];
      state.currentAnswer=null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswerThunk.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.answers = action.payload;
      })
      .addCase(fetchAnswerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(createAnswerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnswerThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAnswerThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = String(action.payload);
      })

      .addCase(getAnswerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnswerById.fulfilled, (state, action) => {
        console.log('action', action.payload)
        state.answers = action.payload;
        state.loading = false;
      })
      .addCase(getAnswerById.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      });
  },
});

export const { clearAnswers } = answersSlice.actions;
export default answersSlice.reducer;
