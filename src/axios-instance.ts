import React from 'react';
import axios from 'axios';

const instance: any = axios.create({
  baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = (
  source: any,
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
) => {
  instance.get(`/main-data.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: any) => {
    setData(res.data);
    console.log('GET: main data loaded');
  }).catch((error: any) => {
    if (instance.isCancel(error)) {
      console.log(error);
    } else {
      console.error(`Error loading main data: ${error}`);
    }
  });
};

const getUserData = (
  source: any,
  token: string,
  userId: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
) => {
  instance.get(`/${userId}.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: any) => {
    setData(res.data);
    console.log('GET: user data loaded');
  }).catch((error: any) => {
    if (instance.isCancel(error)) {
      console.log(error);
    } else {
      console.error(`Error loading main data: ${error}`);
    }
  });
};

export { instance, getMainData, getUserData };
