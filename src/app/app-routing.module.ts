import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewTokenPageComponent } from './pages/new-token-page/new-token-page.component';
import { TokenPageComponent } from './pages/token-page/token-page.component';
import { TokensPageComponent } from './pages/tokens-page/tokens-page.component';

const title = 'CluedIn Sidecar';

const routes: Routes = [

  {
    path: '',
    component: HomePageComponent,
    title: title
  },
  {
    path: 'tokens',
    component: TokensPageComponent,
    title: `${title} - Tokens`
  },
  {
    path: 'tokens/new', 
    component: NewTokenPageComponent,
    title: `${title} - New Token`
  },
  {
    path: 'tokens/:slug-jti',
    component: TokenPageComponent,
    title: `${title} - Token`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
