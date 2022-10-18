import { Token } from 'src/app/models/token';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CluedInService, SearchResponse } from 'src/app/services/cluedin.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  public token: Token | null = null;
  public searchResponse: SearchResponse | null = null;

  searchForm = new FormGroup({
    search: new FormControl('', [])
  });

  get search() { return this.searchForm.get('search'); }

  constructor(
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private cluedInService: CluedInService) { }

  ngOnInit(): void {
    if (window.location.hash) {
      this.search?.setValue(window.location.hash.slice(1));
    }
    this.route.params.subscribe(params => {
      const jti = params['slug-jti'].split('-').pop(); // TODO: this code is duplicated in too many places
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.submit();
          break;
        }
      }
    });
  }

  async submit() {
    if (this.search?.value) {
      window.location.hash = this.search.value;
    }
    this.searchResponse = await this.cluedInService.search(this.token!, this.search?.value ?? '');
  }

}
