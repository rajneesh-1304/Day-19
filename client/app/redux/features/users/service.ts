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

export const fetchUsers = async ({page, limit}: any)=>{
  try {
    const res = await axios.get(`${BASE_URL}/auth`, {
      params: {
        page,
        limit,
      },
    })
    return res.data;
  } catch (err: any) {
    console.error('Error fetching users:', err);
    throw err?.response?.data || err.message;
  }
}

export const deleteUserr = async (id: any) => {
  try {
    await axios.patch(`${BASE_URL}/auth/delete/${id}`)
  } catch (err: any) {
    console.error('Error deleting users:', err);
    throw err?.response?.data || err.message;
  }
}