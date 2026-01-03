import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth", // change if needed
});

export const requestOtp = (email) => {
  return API.post("/requestOtpForRegistration", { email });
};

export const verifyOtp = (email,otp) => {
  return API.post("/verifyOtpForRegistration", {email,otp}, { withCredentials: true });
};

export const resendOtp = (email) => {
  return API.post("/resendOtpForRegistration", {email});
}

export const completeRegistration = (username, password) => {
  return API.post("/register", {username, password}, {withCredentials:true});
}

export const loginRequest = (email,password) => {
  return API.post("/login", {email, password}, {withCredentials:true});
}
