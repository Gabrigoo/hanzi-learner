interface Tones {
  [key: string]: string[]
}

const TONES:Tones = {
  1: ['ā', 'ō', 'ē', 'ī', 'ū', 'ǖ'],
  2: ['á', 'ó', 'é', 'í', 'ú', 'ǘ'],
  3: ['ǎ', 'ǒ', 'ě', 'ǐ', 'ǔ', 'ǚ'],
  4: ['à', 'ò', 'è', 'ì', 'ù', 'ǜ'],
};

const NEUTRAL_TONES:Tones = {
  1: ['a', 'o', 'e', 'i', 'u', 'u'],
  2: ['a', 'o', 'e', 'i', 'u', 'u'],
  3: ['a', 'o', 'e', 'i', 'u', 'u'],
  4: ['a', 'o', 'e', 'i', 'u', 'u'],
};
// use this when tones is marked in character
const toneChecker = (original: string | string[]): [string, string] => {
  let pinyinArray = original instanceof Array ? original : [original];
  let flattened: string[] = [];
  let tone: string[] = [];

  pinyinArray.map((elem) => {
    let newElem: string[] = [];
    let elemTone: string[] = [];

    elem.split('').map((char) => {
      let newChar = char;

      for (let i = 1; i < 5; i++) {
        if (TONES[i].includes(newChar)) {
          elemTone.push(i.toString());
          newChar = NEUTRAL_TONES[i][TONES[i].indexOf(newChar)];
        } else if (!isNaN(parseInt(newChar, 10))) {
          elemTone.push(newChar);
          newChar = "";
        }
      }
      newElem.push(newChar);
    })
    flattened.push(newElem.join(''));
    if (JSON.stringify(elemTone) === JSON.stringify([])) {
      elemTone = ['5'];
    }
    tone.push(elemTone.join(''));
  })
  return [flattened.join(''), tone.join('')];
};

export { TONES, NEUTRAL_TONES, toneChecker };
