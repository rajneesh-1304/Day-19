import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAnswers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/answers`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching questions:", err);
    throw err?.response?.data || err.message;
  }
};

export const createAnswer = async (answerData: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/answers`, answerData);
    return res.data;
  } catch (err: any) {
    console.error("Error creating question:", err);
    throw err?.response?.data || err.message;
  }
};

export const getAnswerId = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/answers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error creating question:", err);
    throw err?.response?.data || err.message;
  }
}
