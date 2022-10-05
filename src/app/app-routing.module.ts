import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewTokenPageComponent } from './pages/new-token-page/new-token-page.component';
import { TokenPageComponent } from './pages/token-page/token-page.component';
import { TokensPageComponent } from './pages/tokens-page/tokens-page.component';

const routes: Routes = [

  { path: '', component: HomePageComponent },
  { path: 'tokens', component: TokensPageComponent },
  { path: 'tokens/new', component: NewTokenPageComponent },
  { path: 'tokens/:slug-jti', component: TokenPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
