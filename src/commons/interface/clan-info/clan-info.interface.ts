import { ClanInfo } from 'src/clan-info/table/clan-info.entity';

export interface findExistsClanInfo {
  existingData: ClanInfo[];
  nonExistingClanNo: number[];
}
