import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    data: {
      preload: true
  },
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'details/:cryptoid/:dbid',
    data: {
      preload: true
  },
    loadChildren: () => import('./crypto-details/crypto-details.module').then( m => m.CryptoDetailsModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
     })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
