import { Injectable } from '@angular/core';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public getTokens(): Token[] {
    return Object
      .entries(localStorage)
      .filter(x => x[0].startsWith('token-'))
      .map(x => JSON.parse(x[1]) as Token);
  }

  public addToken(token: Token): void {
    if (this.getTokens().filter(x => x.accessToken === token.accessToken)) {
      localStorage.setItem(this.getTokenKey(token), JSON.stringify(token));
    } else {
      throw new Error('The token already exists.')
    }
  }

  public updateToken(token: Token): void {
    localStorage.setItem(this.getTokenKey(token), JSON.stringify(token));
  }

  public deleteToken(token: Token): void {
    localStorage.removeItem(this.getTokenKey(token));
  }

  private getTokenKey(token: Token): string {
    return `token-${token.JWT!.jti}`;
  }

  public getTokenSlug(token: Token) {
    return token.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + token.JWT?.jti;
  }

}
