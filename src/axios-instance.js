import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = (source, token, setData) => {
  instance.get(`/main-data.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res) => {
    setData(res.data);
    console.log('GET: main data loaded');
  }).catch((error) => {
    if (instance.isCancel(error)) {
      console.log(error);
    } else {
      console.error(`Error loading main data: ${error}`);
    }
  });
};

const getUserData = (source, token, userId, setData) => {
  instance.get(`/${userId}.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res) => {
    setData(res.data);
    console.log('GET: user data loaded');
  }).catch((error) => {
    if (instance.isCancel(error)) {
      console.log(error);
    } else {
      console.error(`Error loading main data: ${error}`);
    }
  });
};

export { instance, getMainData, getUserData };
