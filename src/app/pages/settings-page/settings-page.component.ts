import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getApiUrl, getOrganizationUrl } from 'src/app/models/jtw';
import { Token } from 'src/app/models/token';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  public token: Token | null = null;

  tokenSettingsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    organizationUrl: new FormControl('', [Validators.required]),
    apiUrl: new FormControl('', [Validators.required])
  });

  get name() { return this.tokenSettingsForm.get('name'); }
  get organizationUrl() { return this.tokenSettingsForm.get('organizationUrl'); }
  get apiUrl() { return this.tokenSettingsForm.get('apiUrl'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const jti = params['slug-jti'].split('-').pop();
      for (let token of this.tokenService.getTokens()) { // TODO: tokenService.getTokens(x => x..JWT?.jti === jti)
        if (token.JWT?.jti === jti) {
          this.token = token;
          this.tokenSettingsForm.get('name')?.setValue(token.name);
          this.tokenSettingsForm.get('organizationUrl')?.setValue(getOrganizationUrl(token));
          this.tokenSettingsForm.get('apiUrl')?.setValue(getApiUrl(token));
        }
      }
    });
  }

  submit() {
    if ( // TODO: is any better way to check this?
      this.token &&
      this.tokenSettingsForm.value.name &&
      this.tokenSettingsForm.value.organizationUrl &&
      this.tokenSettingsForm.value.apiUrl) {
        this.token.name = this.tokenSettingsForm.value.name;
        this.token.organizationUrl = this.tokenSettingsForm.value.organizationUrl;
        this.token.apiUrl = this.tokenSettingsForm.value.apiUrl;
        this.tokenService.updateToken(this.token);
        this.router.navigateByUrl(`/tokens/${this.tokenService.getTokenSlug(this.token)}`);
      }
  }

  resetToken() {
    if (this.token && confirm('Are you sure you want to reset the token?')) {
      this.token.organizationUrl = null;
      this.token.organizationUrl = getOrganizationUrl(this.token);
      
      this.token.apiUrl = null;
      this.token.apiUrl = getApiUrl(this.token);
      
      this.tokenService.updateToken(this.token);
      
      this.router.navigateByUrl(`/tokens/${this.tokenService.getTokenSlug(this.token)}`);
    }
  }

  deleteToken() {
    if (this.token && confirm('Are you sure you want to delete the token?')) {
      this.tokenService.deleteToken(this.token);
      this.router.navigateByUrl('/');
    }
  }
}
