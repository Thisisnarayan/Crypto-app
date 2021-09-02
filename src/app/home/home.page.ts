import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DataService, CryptoList } from '../services/data.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchTerm$ = new Subject<string>();
  searchedQuery: string = null;
  cryptoList: CryptoList[];
  filter = {
    sortingOrder : 0, // 1 for A-Z , 2 for Z-A , 0 for none
  };
  constructor(private data: DataService,
    public actionSheetController: ActionSheetController) {
    this.cryptoList = this.getCrypto();
    this.search(this.searchTerm$).subscribe((results) => {
      if (results !== null) {
        console.log(results);
        this.cryptoList = results;
      }
    });
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getCrypto(): CryptoList[] {
    return this.data.getCryptoList();
  }

  search(terms: any) {
    return terms
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap((term) => this.searchEntries(term)));
  }

  async searchEntries(term) {
    if (term.length <= 0) {
      return this.data.getCryptoList();
    }
    return this.data.getCryptoList().filter((o) => o.id.includes(term));
  }

  async presentActionSheet() {
    const icon = (this.filter.sortingOrder === 1) ? 'arrow-down' : (this.filter.sortingOrder === 2) ? 'arrow-up' : '';
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort',
      buttons: [{
        text: 'Alphabetically (A-Z)',
        icon,
        handler: () => {
          if(this.filter.sortingOrder === 1) {
            this.cryptoList = this.cryptoList.sort( (a,b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0));
            this.filter.sortingOrder = 2;
          } else if(this.filter.sortingOrder === 2) {
            this.cryptoList = this.cryptoList.sort( (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            this.filter.sortingOrder = 0;
          } else {
            this.cryptoList = this.cryptoList.sort( (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            this.filter.sortingOrder = 1;
          }
        }
      }]
    });
    await actionSheet.present();
  }
}
