import axios from "axios";

const newRequest = axios.create({
    baseURL: "https://fiverr-clone-1-928d.onrender.com/api/",
    withCredentials:true,
});

export default newRequest;



