import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/models/token';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.css']
})
export class TokensListComponent implements OnInit {

  constructor(
    public router: Router,
    public tokenService: TokenService) {
    this.tokens = tokenService.getTokens().sort((a, b) => a.name > b.name ? 1 : -1);
  }

  tokens: Token[] = [];

  ngOnInit(): void {
  }

  slug(token: Token): string {
    return this.tokenService.getTokenSlug(token);
  }

  onKey(event: KeyboardEvent) {
    if (this.tokens.length < 1) {
      return;
    }

    // console.log(event);

    const element = event.target as HTMLElement;

    if (element.tagName.toUpperCase() === 'INPUT') {
      const input = (element as HTMLInputElement);
      const type = input.type.toUpperCase();
      if (type === 'TEXT' || type === 'PASSWORD') {
        return;
      }
    }

    const index = parseInt(event.key);

    if (!isNaN(index) && index < this.tokens.length + 1 && index > 0) {
      this.router.navigateByUrl(`/tokens/${this.tokenService.getTokenSlug(this.tokens[index - 1])}`);
    }
  }
}
