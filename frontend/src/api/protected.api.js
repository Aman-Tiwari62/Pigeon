import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/user",
  withCredentials:true, 
});

export const searchUsers = (query) => {
  return API.get(`/search?query=${query}`);
};

export const uploadProfile = (formdata)=>{
  return API.post('/profileUpload', formdata);
}

export const fetchUser = (username)=>{
  return API.get(`/fetch/${username}`)
}

export const checkFollowing = (userId) =>{
  return API.get(`checkFollowing/${userId}`)
}

export const followUser = (userId) => {
  return API.get(`follow/${userId}`)
}
export const unfollowUser = (userId) => {
  return API.get(`unfollow/${userId}`)
}
