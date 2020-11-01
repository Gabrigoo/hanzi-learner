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

const flattenPinyin = (original:string) => {
  let tone = '5';
  const flattened = original.split('').map((char) => {
    for (let i = 1; i < 5; i++) {
      if (TONES[i].includes(char)) {
        tone = i.toString();
        return NEUTRAL_TONES[i][TONES[i].indexOf(char)];
      }
    }
    return char;
  }).join('');
  return [flattened, tone];
};

export { TONES, NEUTRAL_TONES, flattenPinyin };
