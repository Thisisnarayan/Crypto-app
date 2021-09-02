import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.scss'],
})
export class DetailsContainerComponent implements OnInit {
  cryptoDetail: any;
  cNumber = Number;
  chartData: any;
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private dbService: NgxIndexedDBService
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('cryptoid');
    const dbId = this.activatedRoute.snapshot.paramMap.get('dbid');
    this.cryptoDetail = this.data.cryptoListDataMap.get(id);
    this.data
      .getMarketChart(
        id,
        moment().subtract(3, 'month').startOf('month').unix(),
        moment().unix()
      )
      .subscribe(
        (res: any) => {
          this.chartData = res;
          this.dbService
            .update('crypto', {
              id: +dbId,
              name: this.cryptoDetail.id,
              symbol: this.cryptoDetail.symbol,
              metaData: this.cryptoDetail,
              pricesChart: res.prices,
              volumeChart: res.total_volumes,
            })
            .subscribe((storeData) => {});
        },
        (error: any) => {}
      );
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'List' : '';
  }
}
