import { Injectable } from '@angular/core';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  constructor() { }

  public getTokens(): Token[] {
    return Object
      .entries(localStorage)
      .filter(x => x[0].startsWith('token-'))
      .map(x => JSON.parse(x[1]) as Token);
  }

  public addToken(token: Token): void {
    if (this.getTokens().filter(x => x.accessToken === token.accessToken)) {
      localStorage.setItem(`token-${token.JWT?.jti}`, JSON.stringify(token));
    } else {
      throw new Error('The token already exists.')
    }
  }

  public removeToken(token: Token): void {
    //
  }

}
