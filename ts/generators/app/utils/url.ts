import { URL } from 'url';

export function validateUrl(candidate: string) {
  try {
    const url = new URL(candidate);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return;
    }
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(e.message);
    }
  }
  throw new Error(`Invalid URL ${candidate}: protocol must be http: or https:`);
}
