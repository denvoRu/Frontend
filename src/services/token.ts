export function getTokenFromCookie(name: 'access' | 'refresh') {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + `${name}_token`.replace(/([\\.$?*|{}\\(\\)\\[\]\\\\/\\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


export function setTokensToCookies(token: string, tokenType: 'access' | 'refresh', maxAge?:number) {
  const options:Record<string, string | number | boolean> = {
    path: '/',
    secure: true, 
    'max-age': !maxAge ? 3600 : maxAge
  };
  let updatedCookie = encodeURIComponent(`${tokenType}_token`) + "=" + encodeURIComponent(token);
  for (const optionKey in options) {
    updatedCookie += "; " + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function removeTokensFromCookies(tokenType: 'access' | 'refresh') {
  setTokensToCookies("",`${tokenType}`, -1)
}