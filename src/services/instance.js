import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:3000/api-docs/",
    withCredentials : true,
    timeout : 5000,
    headers: {
        "Content-Type" : "application/json",
    },
})