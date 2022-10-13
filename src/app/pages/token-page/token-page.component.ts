import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getOrganizationUrl } from 'src/app/models/jtw';
import { getTokenSlug, Token } from 'src/app/models/token';
import { CluedInService } from 'src/app/services/cluedin.service';
import { TokensService } from 'src/app/services/tokens.service';

@Component({
  selector: 'app-token-page',
  templateUrl: './token-page.component.html',
  styleUrls: ['./token-page.component.css']
})
export class TokenPageComponent implements OnInit {

  public token: Token | null = null;
  public tokenSlug: string | null = null;
  public organizationUrl: string = '#';
  public schema: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokensService,
    private cluedInService: CluedInService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const jti = params['slug-jti'].split('-').pop();
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.tokenSlug = getTokenSlug(token);
          this.organizationUrl = getOrganizationUrl(token);
        }
      }
    });
  }

  onKey(event: KeyboardEvent) {
    // console.log(event);

    const element = event.target as HTMLElement;

    if (element.tagName.toUpperCase() === 'INPUT') {
      const input = (element as HTMLInputElement);
      const type = input.type.toUpperCase();
      if (type === 'TEXT' || type === 'PASSWORD') {
        return;
      }
    }

    switch (event.code) {
      case 'KeyE': // Edit
        this.router.navigateByUrl(`/tokens/${this.tokenSlug}/settings`);
        break;
      case 'KeyS': // Search
        this.router.navigateByUrl(`/tokens/${this.tokenSlug}/search`);
        break;
      case 'KeyV': // Vocabularies
        this.router.navigateByUrl(`/tokens/${this.tokenSlug}/vocabularies`);
        break;
      default:
        break;
    }
  }

}
