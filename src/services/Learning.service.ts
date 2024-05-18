import levels from '../assets/levels';
import { MainInt, UserInt } from '../interfaces';

const learningService = {
  itemsToReview(userData: UserInt): string[] {
    if (!userData) {
      return [];
    }

    const review: string[] = [];
    const currentDate = new Date().getTime();

    Object.keys(userData.characters).forEach((item) => {
      const storedDate = userData.characters[item].lastPract;
      if (userData.characters[item].level === 9) {
        // Good job! No need to review this anymore
      } else if (
        // Item is not ready to be rewieved
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
          >= levels[userData.characters[item].level][0]
      ) {
        review.push(item);
      }
    });
    Object.keys(userData.words).forEach((item) => {
      const storedDate = userData.words[item].lastPract;
      if (userData.words[item].level === 9) {
        // Good job! No need to review this anymore
      } else if (
        // Item is not ready to be rewieved
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
          >= levels[userData.words[item].level][0]
      ) {
        review.push(item);
      }
    });
    return review;
  },

  // determines which items are to be learned by user level
  itemsToLearn(mainData: MainInt, userData: UserInt): string[] {
    if (!mainData || !userData) {
      return [];
    }

    const userStage = userData.profileData.currentStage;

    // characters that are right for the user's level
    const dataCharKeys = Object.keys(mainData.characters)
      .filter((char) => mainData.characters[char].stage <= userStage);

    // words that are right for the user's level
    const dataWordKeys = Object.keys(mainData.words)
      .filter((word) => mainData.words[word].stage <= userStage);

    // checks if all elements of the word are at least GURU level
    const dataWordKeysGuru = dataWordKeys.filter((item) => {
      let applicable = true;
      item.split('').forEach((comp) => {
        if (!Object.keys(userData.characters).includes(comp)) {
          applicable = false;
        } else if (userData.characters[comp].level < 5) {
          applicable = false;
        }
      });
      return applicable;
    });

    const dataKeys = dataCharKeys.concat(dataWordKeysGuru);
    const userKeys = Object.keys(userData.characters).concat(Object.keys(userData.words));

    return dataKeys.filter((char) => !userKeys.includes(char));
  },

};

export default learningService;
