import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { GlobalHttpInterceptorService } from './globalHttpInterceptorService';

import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const dbConfig: DBConfig  = {
  name: 'crypto-data',
  version: 1,
  objectStoresMeta: [{
    store: 'crypto',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'symbol', keypath: 'symbol', options: { unique: false }},
      { name: 'metaData', keypath: 'metaData', options: { unique: false } }
    ]
  }]
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
    HttpClientModule,
    AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  , {
    provide: HTTP_INTERCEPTORS,
    useClass: GlobalHttpInterceptorService,
    multi: true,
  }
],
  bootstrap: [AppComponent],
})
export class AppModule {}
