export class OnlyMissingUser {
  allUsersInfo: NexonUserInfo[];
  allUserNexonSns: Array<number>;
  onlyExistsSnInDB: Array<number>;
}

export class NexonUserInfo {
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}
