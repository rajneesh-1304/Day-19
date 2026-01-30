import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchQuestions, createQuestion, getQuestionId } from "./questionService";

export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  displayName: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  user: User;
  tags: Tag[];
}

interface QuestionsState {
  questions: Question[];
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
};

export const fetchQuestionsThunk = createAsyncThunk(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchQuestions();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch questions");
    }
  }
);

export const createQuestionThunk = createAsyncThunk(
  "questions/create",
  async (questionData: {
    title: string;
    description: string;
    type: string;
    userId: number;
    tags: string[];
  }, { rejectWithValue }) => {
    try {
      return await createQuestion(questionData);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
);

export const getQuestionById = createAsyncThunk(
  "question/getbyId",
  async (id: string, { rejectWithValue })=>{
    try {
      return await getQuestionId(id);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
)

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(createQuestionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.currentQuestion = action.payload;
        state.loading = false;
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
