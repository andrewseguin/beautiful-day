export function containsEmail(list: string[] = [], email: string) {
  list = list.map(value => value.toLowerCase().trim());
  email = email.toLowerCase().trim();
  return list.indexOf(email) != -1;
}
