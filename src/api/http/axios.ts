import axios from "axios";

const protocol = document.location.protocol;
const hostname = document.location.hostname;
export const axiosApi = axios.create({baseURL: `${protocol}//${hostname}:8090/`});

axiosApi.interceptors.request.use(request => {
    return request;
}, (error) => {
    console.log('REQUEST ERROR: ' + error);
})

// axiosApi.interceptors.response.use(response => {
//     return response;
// }, (error) => {
//     console.log('RESPONSE ERROR: ' + error)
//     return Promise.reject(error);
// })

axiosApi.interceptors.response.use(response => {
    return response;
},
    (error) => {
        console.log('RESPONSE ERROR: ' + error)
    }
)
