export function isPhoneUserAgent(ua: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
}
