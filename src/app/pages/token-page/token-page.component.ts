import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, public tokenService: TokensService, public cluedInService: CluedInService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const jti = params['slug-jti'].split('-').pop();
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.tokenSlug = getTokenSlug(token);
          this.organizationUrl = getOrganizationUrl(token);
          this.cluedInService.getEntitySchema(this.token).then(result => this.schema = JSON.stringify(result, null, 2));
        }
      }
    });
  }

}
