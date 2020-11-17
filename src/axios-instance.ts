import React from 'react';
import axios, { AxiosError } from 'axios';

const instance: any = axios.create({
  baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = (
  source: any,
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
): void => {
  instance.get(`/main-data.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: any) => {
    const fullData = {
      characters: {},
      words: {},
    };
    if ('characters' in res.data) {
      fullData.characters = res.data.characters;
    }
    if ('words' in res.data) {
      fullData.words = res.data.words;
    }
    setData(fullData);
    console.log('GET: main data loaded');
  }).catch((error: AxiosError) => {
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
): void => {
  instance.get(`/${userId}.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: any) => {
    const fullData = {
      characters: {},
      profileData: res.data.profileData,
      words: {},
    };
    if ('characters' in res.data) {
      fullData.characters = res.data.characters;
    }
    if ('words' in res.data) {
      fullData.words = res.data.words;
    }
    setData(fullData);
    console.log('GET: user data loaded');
  }).catch((error: AxiosError) => {
    if (instance.isCancel(error)) {
      console.log(error);
    } else {
      console.error(`Error loading main data: ${error}`);
    }
  });
};

export { instance, getMainData, getUserData };
