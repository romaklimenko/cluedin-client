import { JWT, parseJwt, getOrganizationUrl, getApiUrl } from "./jtw";

export class Token {
  constructor(public name: string, public accessToken: string) {
    this.JWT = parseJwt(accessToken);
    this.organizationUrl = getOrganizationUrl(this);
    this.apiUrl = getApiUrl(this);
  }

  public readonly JWT: JWT | null = null;

  public organizationUrl: string | null = null;
  
  public apiUrl: string | null = null;
}

export function getTokenSlug(token: Token): string {
  return token.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + token.JWT?.jti;
}