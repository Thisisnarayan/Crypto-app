import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.scss'],
})
export class DetailsContainerComponent implements OnInit {
  cryptoDetail: any;
  cNumber = Number;
  chartData: any;
  dbId: any;
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private dbService: NgxIndexedDBService,
    private util: UtilService
  ) {}

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('cryptoid');
    this.dbId = this.activatedRoute.snapshot.paramMap.get('dbid');
    this.cryptoDetail = this.data.cryptoListDataMap.get(id);
    const prevAddedData: any = await this.data.graphDataLocalGet(id);
    if (prevAddedData !== null && prevAddedData !== undefined) {
      if (
        prevAddedData.pricesChart !== null &&
        prevAddedData.pricesChart !== undefined
      ) {
        this.chartData = {
          prices: prevAddedData.pricesChart,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          total_volumes: prevAddedData.volumeChart,
        };
      } else {
        // network call
        this.chartData = await this.chartDataGet(id, this.dbId);
      }
    } else {
      // network call
      this.chartData = await this.chartDataGet(id, this.dbId);
    }
  }

  chartDataGet(id, dbId) {
    return new Promise((resolve) => {
      if (this.util.networkStatus) {
        this.data
          .getMarketChart(
            id,
            moment().subtract(3, 'month').startOf('month').unix(),
            moment().unix()
          )
          .subscribe(
            (res: any) => {
              this.dbService
                .update('crypto', {
                  id: +dbId,
                  name: this.cryptoDetail.id,
                  symbol: this.cryptoDetail.symbol,
                  metaData: this.cryptoDetail,
                  pricesChart: res.prices,
                  volumeChart: res.total_volumes,
                })
                .subscribe((storeData) => {
                  resolve(res);
                });
            },
            (error: any) => {}
          );
      }
    });
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'List' : '';
  }

  setFav(v) {
    this.cryptoDetail.fav = v;
    this.dbService
      .update('crypto', {
        id: +this.dbId,
        name: this.cryptoDetail.id,
        symbol: this.cryptoDetail.symbol,
        metaData: this.cryptoDetail,
        pricesChart: this.chartData.prices,
        volumeChart: this.chartData.total_volumes,
      })
      .subscribe((storeData) => {});
  }
}
