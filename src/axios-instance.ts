import React from 'react';
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios';
import { MainInt, UserInt } from './interfaces';
// I cannot give any other type than any here because neither instance types work :(
const instance: any = axios.create({
  baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = (
  source: CancelTokenSource,
  token: string,
  setData: React.Dispatch<React.SetStateAction<MainInt|null>>,
): void => {
  instance.get(`/main-data.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: AxiosResponse) => {
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
  source: CancelTokenSource,
  token: string,
  userId: string,
  setData: React.Dispatch<React.SetStateAction<UserInt|null>>,
): void => {
  instance.get(`/${userId}.json?auth=${token}`, {
    cancelToken: source.token,
  }).then((res: AxiosResponse) => {
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
