import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseJwt } from 'src/app/models/jtw';
import { Token } from 'src/app/models/token';
import { TokensService } from 'src/app/services/tokens.service';

@Component({
  selector: 'app-new-token-page',
  templateUrl: './new-token-page.component.html',
  styleUrls: ['./new-token-page.component.css']
})
export class NewTokenPageComponent implements OnInit {

  newTokenForm = new FormGroup({
    token: new FormControl('', [Validators.required, this.jwtValidator()]),
    name: new FormControl('', [Validators.required])
  });

  get token() { return this.newTokenForm.get('token'); }
  get name()  { return this.newTokenForm.get('name');  }

  constructor(public router: Router, public tokensService: TokensService) {
    //
  }

  ngOnInit(): void {
  }

  jwtValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length === 0) {
        return null;
      }
      
      let jwt;
      try {
        jwt = parseJwt(control.value);
      } catch(error) {
        return {
          'error': 'Can\'t parse this token.'
        };
      }

      if (this.tokensService.getTokens().filter(x => x.accessToken === control.value).length > 0) {
        return {
          'error': 'Token already exists.'
        };
      }
      
      return null;
    };
  }

  get jwtJsonString(): string | null {
    if (!this.newTokenForm.value.token) {
      return '';
    }
    try {
      return JSON.stringify(parseJwt(this.newTokenForm.value.token), null, 2);
    } catch (error) {
      return '';
    }
  }

  submit() {
    if (this.newTokenForm.value.name && this.newTokenForm.value.token) {
      this.tokensService.addToken(
        new Token(
          this.newTokenForm.value.name,
          this.newTokenForm.value.token));
      this.router.navigateByUrl('tokens');
    }
  }

}
