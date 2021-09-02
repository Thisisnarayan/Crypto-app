import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CryptoDetailsRoutingModule } from './crypto-details-routing.module';
import {DetailsContainerComponent} from './details-container/details-container.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PriceVloumeChartComponent } from './price-vloume-chart/price-vloume-chart.component';
@NgModule({
  declarations: [DetailsContainerComponent , PriceVloumeChartComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    CryptoDetailsRoutingModule
  ]
})
export class CryptoDetailsModule { }
