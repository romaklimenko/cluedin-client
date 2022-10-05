import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TokensPageComponent } from './pages/tokens-page/tokens-page.component';
import { TokenPageComponent } from './pages/token-page/token-page.component';
import { HeaderComponent } from './components/header/header.component';
import { TokensListComponent } from './components/tokens-list/tokens-list.component';
import { NewTokenPageComponent } from './pages/new-token-page/new-token-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TokensPageComponent,
    TokenPageComponent,
    HeaderComponent,
    TokensListComponent,
    NewTokenPageComponent
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
