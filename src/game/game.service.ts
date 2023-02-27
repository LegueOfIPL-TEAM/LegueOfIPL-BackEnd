import { Injectable } from '@nestjs/common';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository) {}

  async refactoringDataPushInDb(refactoringData: AllOfDataAfterRefactoring[]) {
    refactoringData.forEach((matchData) => {
      const {
        matchKey,
        matchTime,
        mapName,
        plimit,
        redResult,
        redClanNo,
        redClanName,
        redClanMark1,
        redClanMark2,
        redUserList,
        blueResult,
        blueClanNo,
        blueClanName,
        blueClanMark1,
        blueClanMark2,
        blueUserList,
      } = matchData;

      if (redResult === 'win') {
      }
      // if blue team win db insert
    });
  }
}
