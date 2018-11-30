import {Project} from 'app/season/dao';

export function createRequest(
    project: Project, itemId: string, quantity: number) {
  const defaultDate = new Date();
  const date = project.defaultDropoffDate ?
    new Date(project.defaultDropoffDate) : defaultDate;
  return {
    item: itemId,
    project: project.id,
    quantity,
    dropoff: project.defaultDropoffLocation,
    date: date.toISOString(),
  };
}
