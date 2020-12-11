import React, { useEffect } from 'react';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import { MainInt, UserInt } from '../interfaces';

const GetData = (
  currentUser: any,
  token: string | null,
  userId: string | null,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
  setUserId: React.Dispatch<React.SetStateAction<string | null>>,
  setMainData: React.Dispatch<React.SetStateAction<MainInt | null>> | null,
  setUserData: React.Dispatch<React.SetStateAction<UserInt | null>> | null,
): void => {
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [currentUser]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token && userId) {
      if (setMainData) {
        getMainData(source, token, setMainData);
      }
      if (setUserData) {
        getUserData(source, token, userId, setUserData);
      }
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);
};

export default GetData;
