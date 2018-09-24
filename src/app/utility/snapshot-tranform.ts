import {SnapshotAction} from '@angular/fire/database';

export function transformSnapshotAction(action: SnapshotAction<any>) {
  const $key = action.payload.key;
  return { $key, ...action.payload.val() };
}

export function transformSnapshotActionList(actions: SnapshotAction<any>[]) {
  return actions.map(transformSnapshotAction);
}
