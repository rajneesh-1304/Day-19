import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (loginData: any) => {
  try {
    const url = `${BASE_URL}/auth/login`
    const res = await axios.post(url, loginData);
    return res.data;
  } catch (error) {
    console.error("Error in Reigstering User:", error);
    throw error;
  }
}

export const registerUser = async (registerData: any) => {
  try {
    const url = `${BASE_URL}/auth/register`;
    const res = await axios.post(url, registerData);
    return res.data;
  } catch (error) {
    console.error("Error in Reigstering User:", error);
    throw error;
  }
}