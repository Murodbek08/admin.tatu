import axios from "axios";

const request = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
});

export default request;
