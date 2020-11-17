import { toneChecker } from "./tones";

test('simple word tone after', () => {
    expect(toneChecker('zhong1')).toStrictEqual(['zhong','1']);
  });
test('simple word tone inside', () => {
    expect(toneChecker('lián')).toStrictEqual(['lian','2']);
  });
test('simple word no tone', () => {
    expect(toneChecker('men')).toStrictEqual(['men','5']);
  });
test('compound word tone after', () => {
    expect(toneChecker('ni3hao3')).toStrictEqual(['nihao','33']);
  });
test('compound word tone inside', () => {
    expect(toneChecker('nǐhǎo')).toStrictEqual(['nihao','33']);
  });
test('triple compound inside', () => {
    expect(toneChecker('xīngqíliù')).toStrictEqual(['xingqiliu','124']);
  });
test('quad compound after', () => {
    expect(toneChecker('Shen2me5shi2hou4')).toStrictEqual(['Shenmeshihou','2524']);
  });
