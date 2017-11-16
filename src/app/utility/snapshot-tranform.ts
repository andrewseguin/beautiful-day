import {SnapshotAction} from 'angularfire2/database';

export function transformSnapshotAction(action: SnapshotAction) {
  const $key = action.payload.key;
  return { $key, ...action.payload.val() };
}

export function transformSnapshotActionList(actions: SnapshotAction[]) {
  return actions.map(transformSnapshotAction);
}
