import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CONSTANTS } from '../CONSTANTS';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit {
  @Input() cryptoItem: any;
  cNumber = Number;
  metaData: any;
  constructor(
    private data: DataService,
    private dbService: NgxIndexedDBService
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

  async callMetaData(item) {
    this.metaData = await this.data.metaUpdate(this.cryptoItem.id);
    this.metaData.last_updated_at_local = new Date();
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
        });
    } else {
      this.dbService
        .update('crypto', {
          id: item.id,
          name: this.cryptoItem.id,
          symbol: this.cryptoItem.symbol,
          metaData: this.metaData,
        })
        .subscribe((storeData) => {
          console.log('storeData: ', storeData);
        });
    }
  }
}
