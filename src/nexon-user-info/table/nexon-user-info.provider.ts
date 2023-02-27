import { NEXON_USER_INFO } from 'src/core/constants';
import { NexonUserInfo } from './nexon-user-info.entitiy';

export const nexonUserInfo = [
  {
    provide: NEXON_USER_INFO,
    useValue: NexonUserInfo,
  },
];
