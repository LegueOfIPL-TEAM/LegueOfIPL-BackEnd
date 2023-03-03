import {
  ConsoleLogger,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CLAN_INFO } from 'src/core/constants';
import { ClanInfo } from './clan-info.entity';
import {
  CreateClanInfo,
  findManyclanNo,
} from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ClanInfoRepository {
  constructor(
    @Inject(CLAN_INFO)
    private clanInfoEntitiy: typeof ClanInfo,
  ) {}

  async SortByFanking() {
    try {
      const ladderPoint = await this.clanInfoEntitiy.findAll({
        order: [['ladderPoint', 'DESC']],
      });

      return ladderPoint;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async findClanNos(clanNo: Array<number>) {
    try {
      const findAllClanNos = await this.clanInfoEntitiy.findAll({
        where: {
          clanNo,
        },
      });

      return findAllClanNos;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async findAllClan() {
    try {
      return this.clanInfoEntitiy.create(
        {
          clanNo: '123456',
          clanName: 'test',
          clanMark1: 'test1',
          clanMark2: 'test2',
          nexonUserInfo: {
            userNexonSn: 1234,
          },
        },
        {
          include: [NexonUserInfo],
        },
      );
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async createManyClanInfo(matchDetail: CreateClanInfo[]) {
    const createManyClanInfo = matchDetail.map(async (matchData, index) => {
      const {
        redClanName,
        redClanNo,
        redClanMark1,
        redClanMark2,
        redUserList,
        blueClanName,
        blueClanNo,
        blueClanMark1,
        blueClanMark2,
        blueUserList,
      } = matchData;

      const blueUserNexonSn = blueUserList.map((user) => ({
        userNexonSn: user.userNexonSn,
      }));

      const redUserNexonSn = redUserList.map((user) => ({
        userNexonSn: user.userNexonSn,
      }));
      try {
        const createClanInfo = await this.clanInfoEntitiy.bulkCreate(
          [
            {
              clanNo: redClanNo,
              clanName: redClanName,
              clanMark1: redClanMark1,
              clanMark2: redClanMark2,
              nexonUserInfo: [...redUserNexonSn],
            },
            {
              clanNo: blueClanNo,
              clanName: blueClanName,
              clanMark1: blueClanMark1,
              clanMark2: blueClanMark2,
              nexonUserInfo: [...blueUserNexonSn],
            },
          ],
          {
            include: [
              {
                model: NexonUserInfo,
                as: 'nexonUserInfo',
              },
            ],
          },
        );
        return createClanInfo;
      } catch (e) {
        throw new HttpException(e.message, 500);
      }
    });

    const response = await Promise.all(createManyClanInfo);

    return response.flat();
  }
}
