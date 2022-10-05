import { JWT, parseJwt } from "./jtw";

export class Token {
  constructor(public name: string, public accessToken: string) {
    this.JWT = parseJwt(accessToken);
  }

  public readonly JWT: JWT | null = null;
}