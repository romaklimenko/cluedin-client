import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NewTokenPageComponent } from './pages/new-token-page/new-token-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { TokenPageComponent } from './pages/token-page/token-page.component';
import { TokenSettingsPageComponent } from './pages/token-settings-page/token-settings-page.component';
import { VocabulariesPageComponent } from './pages/vocabularies-page/vocabularies-page.component';

const title = 'CluedIn Sidecar';

const routes: Routes = [

  {
    path: '',
    component: HomePageComponent,
    title: title
  },
  {
    path: 'tokens/new', 
    component: NewTokenPageComponent,
    title: `${title} - New Token`
  },
  {
    path: 'tokens/:slug-jti/search',
    component: SearchPageComponent,
    title: `${title} - Search`
  },
  {
    path: 'tokens/:slug-jti/settings',
    component: TokenSettingsPageComponent,
    title: `${title} - Token Settings`
  },
  {
    path: 'tokens/:slug-jti/vocabularies',
    component: VocabulariesPageComponent,
    title: `${title} - Vocabularies`
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
