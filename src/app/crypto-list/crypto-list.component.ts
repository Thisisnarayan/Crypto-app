import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CONSTANTS } from '../CONSTANTS';
import { UtilService } from '../services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit {
  @Input() cryptoItem: any;
  cNumber = Number;
  metaData: any;
  dbid: any = null;
  moment = moment;
  constructor(
    private data: DataService,
    private dbService: NgxIndexedDBService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.metaDataUpdateOfCrypto();
  }

  metaDataUpdateOfCrypto() {
    // Free API* has a rate limit of 50 calls/minute.
    // so below logic is for call the api after cheking with last update time
    // maintaining configured min time (more than 5 min) gape between api call and data update in local and in hash map
    this.dbService
      .getByIndex('crypto', 'name', this.cryptoItem.id)
      .subscribe((res: any) => {
        console.log(res);
        if (res !== undefined && res !== null) {
          const currentdate = new Date().getTime();
          if (res.metaData !== undefined) {
            this.metaData = res.metaData;
            this.dbid = res.id;
            const latUpdateDate = new Date(
              res.metaData.last_updated_at_local
            ).getTime();
            console.log(Math.floor((currentdate - latUpdateDate) / 60000));
            if (
              Math.floor((currentdate - latUpdateDate) / 60000) >
              CONSTANTS.dataUpdateInterval
            ) {
              this.callMetaData(res);
            } else {
              this.metaData = res.metaData;
              this.data.cryptoListDataMap.set(
                this.cryptoItem.id,
                this.metaData
              );
            }
          } else {
            this.callMetaData(res);
          }
        } else {
          this.callMetaData(null);
        }
      });
  }

  /**
   * if metadata of crypto is not present in local db then call api and update in localdb.
   *
   * @param  item object with id if previously added or null value.
   *
   */
  async callMetaData(item) {
    if (this.util.networkStatus) {
      this.metaData = await this.data.metaUpdate(this.cryptoItem.id);
      this.metaData.last_updated_at_local = new Date();
      this.metaData.fav = false;
      this.data.cryptoListDataMap.set(this.cryptoItem.id, this.metaData);
      if (item == null) {
        this.dbService
          .add('crypto', {
            name: this.cryptoItem.id,
            symbol: this.cryptoItem.symbol,
            metaData: this.metaData,
          })
          .subscribe((key) => {
            console.log('key: ', key);
            this.dbid = key;
          });
      } else {
        this.dbid = item.id;
        this.dbService
          .update('crypto', {
            id: item.id,
            name: this.cryptoItem.id,
            symbol: this.cryptoItem.symbol,
            metaData: this.metaData,
          })
          .subscribe((storeData: any) => {});
      }
    }
  }
}
