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
  damage: string;
  grade: string;
  weapon: string;
}
