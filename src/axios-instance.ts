import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import AxiosErrorObj from 'axios-error';
import {
  MainInt, UserInt, MainCharacterInt, MainWordInt, UserCharacterInt, SessionInt,
} from './interfaces';
// I cannot give any other type than any here because neither instance types work :(
const instance: any = axios.create({
  baseURL: 'https://hanzi-learner-466ac-default-rtdb.europe-west1.firebasedatabase.app',
});
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

const getMainData = async (
  source: CancelTokenSource,
  token: string,
): Promise<MainInt | AxiosErrorObj> => {
  try {
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
    return fullData;
  } catch (error: any) {
    console.error(`Error loading main data: ${error}`);
    return new AxiosErrorObj(error);
  }
};

const getUserData = async (
  source: CancelTokenSource,
  token: string,
  userId: string,
): Promise<UserInt | AxiosErrorObj> => {
  try {
    const response: AxiosResponse<UserInt> = await instance.get(`/${userId}.json?auth=${token}`, {
      cancelToken: source.token,
    });
    const fullData = {
      characters: {},
      profileData: { currentStage: 0 },
      words: {},
      sessionData: {
        sessionStart: null,
        remainingList: [],
        correctList: [],
        incorrectList: [],
      },
    };
    fullData.profileData = response.data.profileData;
    if ('characters' in response.data) {
      fullData.characters = response.data.characters;
    }
    if ('words' in response.data) {
      fullData.words = response.data.words;
    }
    if ('sessionData' in response.data) {
      fullData.sessionData = Object.assign(fullData.sessionData, response.data.sessionData);
    }
    console.log('GET: user data loaded');
    return fullData;
  } catch (error: any) {
    console.error(`Error loading user data: ${error}`);
    return new AxiosErrorObj(error);
  }
};

const addNewWord = async (
  word: string,
  object: MainCharacterInt | MainWordInt,
  token: string,
): Promise<AxiosResponse<any> | AxiosErrorObj> => {
  const type = word.length > 1 ? 'words' : 'characters';
  try {
    const response: AxiosResponse = await instance.put(`/main-data/${type}/${word}.json?auth=${token}`, object);
    console.log('PUT: New word upload complete');
    return response;
  } catch (error: any) {
    console.error(`Error adding new entry: ${error}`);
    return new AxiosErrorObj(error);
  }
};

const addUserData = async (
  word: string,
  object: UserCharacterInt,
  token: string,
  userId: string,
): Promise<AxiosResponse<any> | AxiosErrorObj> => {
  const type = word.length > 1 ? 'words' : 'characters';
  try {
    const response: AxiosResponse = await instance.put(`/${userId}/${type}/${word}.json?auth=${token}`, object);
    console.log('PUT: new user data uploaded');
    return response;
  } catch (error: any) {
    console.error(`Error uploading new user data: ${error}`);
    return new AxiosErrorObj(error);
  }
};

const setUserLevel = async (
  newLevel: number,
  token: string,
  userId: string,
): Promise<AxiosResponse<any> | AxiosErrorObj> => {
  try {
    const response: AxiosResponse = await axios.put(`/${userId}/profileData/currentStage.json?auth=${token}`, newLevel);
    console.log('PUT database overwritten');
    return response;
  } catch (error: any) {
    console.error(`Error uploading new user data: ${error}`);
    return new AxiosErrorObj(error);
  }
};

const addReviewData = async (
  object: SessionInt,
  token: string,
  userId: string,
): Promise<AxiosResponse<any> | AxiosErrorObj> => {
  try {
    const response: AxiosResponse = await instance.put(`/${userId}/sessionData.json?auth=${token}`, object);
    console.log('PUT: new session data uploaded');
    return response;
  } catch (error: any) {
    console.error(`Error uploading new user data: ${error}`);
    return new AxiosErrorObj(error);
  }
};

export {
  instance, getMainData, getUserData, addNewWord, addUserData, setUserLevel, addReviewData,
};
