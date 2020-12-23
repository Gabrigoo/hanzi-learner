import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios';
import {
  MainInt, UserInt, MainCharacterInt, MainWordInt, UserCharacterInt,
} from './interfaces';
// I cannot give any other type than any here because neither instance types work :(
const instance: any = axios.create({
  baseURL: 'https://fir-sample-project-5efcf.firebaseio.com/',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = async (
  source: CancelTokenSource,
  token: string,
): Promise<MainInt> => {
  const response: AxiosResponse = await instance.get(`/main-data.json?auth=${token}`, {
    cancelToken: source.token,
  });

  const fullData = {
    characters: {},
    words: {},
  };
  if ('characters' in response.data) {
    fullData.characters = response.data.characters;
  }
  if ('words' in response.data) {
    fullData.words = response.data.words;
  }
  console.log('GET: main data loaded');
  // How do I put an error handling here???
  return fullData;
};

const getUserData = async (
  source: CancelTokenSource,
  token: string,
  userId: string,
): Promise<UserInt> => {
  const response: AxiosResponse = await instance.get(`/${userId}.json?auth=${token}`, {
    cancelToken: source.token,
  });
  const fullData = {
    characters: {},
    profileData: response.data.profileData,
    words: {},
  };
  if ('characters' in response.data) {
    fullData.characters = response.data.characters;
  }
  if ('words' in response.data) {
    fullData.words = response.data.words;
  }
  console.log('GET: user data loaded');
  // How do I put an error handling here???
  return fullData;
};

const addNewWord = (
  word: string,
  object: MainCharacterInt | MainWordInt,
  token: string,
): void => {
  const type = word.length > 1 ? 'words' : 'characters';

  instance.put(`/main-data/${type}/${word}.json?auth=${token}`, object)
    .then(() => { console.log('PUT: Upload complete'); })
    .catch((error: AxiosError) => console.error(`Error adding new entry: ${error}`));
};

const addUserData = (
  word: string,
  object: UserCharacterInt,
  token: string,
  userId: string,
): void => {
  const type = word.length > 1 ? 'words' : 'characters';

  instance.put(`/${userId}/${type}/${word}.json?auth=${token}`, object)
    .then(() => { console.log('PUT: new user data uploaded'); })
    .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
};

const setUserLevel = (
  newLevel: number,
  token: string,
  userId: string,
): void => {
  axios.put(`/${userId}/profileData/currentStage.json?auth=${token}`, newLevel)
    .then(() => {
      console.log('PUT database overwritten');
    }).catch((error: AxiosError) => console.error(`Error updating database: ${error}`));
};

export {
  instance, getMainData, getUserData, addNewWord, addUserData, setUserLevel,
};
