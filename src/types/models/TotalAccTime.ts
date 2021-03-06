import { objectType } from '@nexus/schema';
import { sep } from 'path';

export const TotalAccTime = objectType({
  name: 'TotalAccTime',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.deletedAt();
    t.model.accTime();
    t.field('user', { type: 'User', nullable: false });
  },
});
