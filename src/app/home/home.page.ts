import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DataService, CryptoList } from '../services/data.service';
import { ActionSheetController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchTerm$ = new Subject<any>();
  searchedQuery: string = null;
  cryptoList: CryptoList[];
  subscription: Subscription;
  filter = {
    sortingOrder: 0, // 1 for A-Z , 2 for Z-A , 0 for none
  };
  constructor(
    private data: DataService,
    public actionSheetController: ActionSheetController,
    private platform: Platform
  ) {
    this.cryptoList = this.getCrypto();
    this.searchTerm$.subscribe((e: Event) => {
      this.cryptoList = this.searchEntries(
        (e.target as HTMLInputElement).value
      );
    });
  }

  getCrypto(): CryptoList[] {
    return this.data.getCryptoList();
  }

  searchEntries(term) {
    if (term !== null && term !== undefined) {
      if (term.length <= 0) {
        return this.data.getCryptoList();
      }
      return this.data
        .getCryptoList()
        .filter((o) => o.id.toLowerCase().includes(term.toLowerCase()));
    } else {
      return this.data.getCryptoList();
    }
  }

  async presentActionSheet() {
    // show icon up and down based on sorting
    const icon =
      this.filter.sortingOrder === 1
        ? 'arrow-down'
        : this.filter.sortingOrder === 2
        ? 'arrow-up'
        : '';
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort',
      buttons: [
        {
          text: `Alphabetically (A-Z)`,
          icon,
          handler: () => {
            if (this.filter.sortingOrder === 1) {
              this.cryptoList = this.data
                .getCryptoList()
                .sort((a, b) =>
                  a.name < b.name ? 1 : b.name < a.name ? -1 : 0
                );
              this.filter.sortingOrder = 2;
            } else if (this.filter.sortingOrder === 2) {
              this.cryptoList = this.data.getCryptoList();
              this.filter.sortingOrder = 0;
            } else {
              this.cryptoList = this.data
                .getCryptoList()
                .sort((a, b) =>
                  a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                );
              this.filter.sortingOrder = 1;
            }
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
