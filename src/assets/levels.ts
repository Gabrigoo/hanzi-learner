interface Levels {
  [key: string]: [number, string, string]
}

const LEVELS: Levels = {
  0: [0, 'New Item', 'New Item'],
  1: [4, 'Apprentice 1', 'Apprentice'],
  2: [8, 'Apprentice 2', 'Apprentice'],
  3: [24, 'Apprentice 3', 'Apprentice'],
  4: [48, 'Apprentice 4','Apprentice'],
  5: [168, 'Guru 1', 'Guru'],
  6: [336, 'Guru 2', 'Guru'],
  7: [720, 'Master', 'Master'],
  8: [2880, 'Enlightened', 'Enlightened'],
  9: [0, 'Burned', 'Burned'],
};

export default LEVELS;
