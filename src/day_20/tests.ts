import { doPart1, doPart2 } from './puzzle';

const input: string = 'ENWWW(NEEE|SSE(EE|N))';
const input2: string = 'ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN';
const input3: string = 'ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))'
const input4: string = 'WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))';
const input5: string = 'NNNNN(EEEEE|WWWWW)SSSSS'

// doPart1(input);
// doPart1(input2);
doPart1(input3);
// doPart1(input4);
// doPart1(input5);

doPart2(input3, 20);
