import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/'
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

export { instance } ;