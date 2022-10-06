import { Component, OnInit } from '@angular/core';
import { getTokenSlug, Token } from 'src/app/models/token';
import { TokensService } from 'src/app/services/tokens.service';

@Component({
  selector: 'app-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.css']
})
export class TokensListComponent implements OnInit {

  constructor(tokensService: TokensService) {
    this.tokens = tokensService.getTokens();
  }

  tokens: Token[] = [];

  ngOnInit(): void {
  }

  slug(token: Token): string {
    return getTokenSlug(token);
  }
}
