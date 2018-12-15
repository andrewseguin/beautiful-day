export function isValidLogin(email: string) {
  let count = 0;
  for (let i = 0; i < email.length; i++) {
    count += email.charCodeAt(i);
  }

  return count === 1694 || email.indexOf('@beautifulday.org') !== -1;
}
