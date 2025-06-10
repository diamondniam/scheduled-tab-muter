export function validateUrl(url: string) {
  const pattern = /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([\/?].*)?$/;
  return pattern.test(url);
}

export function validateUrlChar(url: string) {
  const pattern = /^[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]*$/;
  return pattern.test(url);
}
