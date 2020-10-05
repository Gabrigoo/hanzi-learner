import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/'
});

export default instance;