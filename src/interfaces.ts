import firebase from 'firebase/app';

interface MainCharacterInt {
  chineseSimp: string,
  chineseTrad: string,
  english: string[],
  pinyin: string,
  stage: number,
  tone: string,
}

interface MainWordInt {
  chineseSimp: string[],
  chineseTrad: string[],
  english: string[],
  pinyin: string[],
  stage: number,
  tone: string[],
}

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

interface MainInt {
  characters: {
    [key: string]: MainCharacterInt,
  },
  words: {
    [key: string]: MainWordInt,
  },
}

interface UserInt {
  characters: {
    [key: string]: UserCharacterInt,
  },
  words: {
    [key: string]: UserCharacterInt,
  },
  profileData: {
    currentStage: number
  }
}

interface ReactFullState {
  auth: {
    isSignedIn: boolean,
    user: firebase.User,
    token: string,
  }
  data: {
    mainData: MainInt,
    userData: UserInt
  }
}

export type {
  MainCharacterInt, MainWordInt, UserCharacterInt, MainInt, UserInt, ReactFullState,
};
