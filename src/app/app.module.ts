import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TokenPageComponent } from './pages/token-page/token-page.component';
import { HeaderComponent } from './components/header/header.component';
import { TokensListComponent } from './components/tokens-list/tokens-list.component';
import { NewTokenPageComponent } from './pages/new-token-page/new-token-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { VocabulariesPageComponent } from './pages/vocabularies-page/vocabularies-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { EntityPageComponent } from './pages/entity-page/entity-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TokenPageComponent,
    HeaderComponent,
    TokensListComponent,
    NewTokenPageComponent,
    SettingsPageComponent,
    VocabulariesPageComponent,
    SearchPageComponent,
    EntityPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
