import { Token } from "./token";

export function parseJwt(rawJwt: string): JWT | null {
  const base64string = rawJwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(
    decodeURIComponent(
      window.atob(base64string) // we use window here as a workaround because node's atob is deprecated
        .split('')
        .map(char => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')));
}

export function getOrganizationUrl(token: Token) {
  if (token.organizationUrl) {
    return token.organizationUrl;
  }
  const url = new URL(token.JWT!.iss!);
  const hostnameParts = url.hostname.split('.');
  hostnameParts[0] = token.JWT!.ClientId!;
  return `${url.protocol}//${hostnameParts.join('.')}/`;
}

export function getApiUrl(token: Token) {
  if (token.apiUrl) {
    return token.apiUrl;
  }
  return `${getOrganizationUrl(token)}api/api/`;
}

export interface JWT {
  nbf: number | null;
  exp: number | null;
  iss: string | null;
  aud: string[] | null;
  client_id: string | null;
  role: string | null;
  ClientId: string | null;
  OrganizationId: string | null;
  OrganizationName: string | null;
  OrganizationClientReference: string | null;
  Id: string | null;
  api: string | null;
  jti: string | null;
  iat: string | null;
  scope: string[] | null;
}
