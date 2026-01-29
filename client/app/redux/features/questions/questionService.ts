import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchQuestions = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/questions`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching questions:", err);
    throw err?.response?.data || err.message;
  }
};

export const createQuestion = async (questionData: {
  title: string;
  description: string;
  type: string;
  userId: number;
  tags: string[];
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/questions`, questionData);
    return res.data;
  } catch (err: any) {
    console.error("Error creating question:", err);
    throw err?.response?.data || err.message;
  }
};
