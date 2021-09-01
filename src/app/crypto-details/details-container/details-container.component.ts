import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.scss'],
})
export class DetailsContainerComponent implements OnInit {
  cryptoDetail: any;
  cNumber = Number;
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cryptoDetail = this.data.cryptoListDataMap.get(id);
    this.data
      .getMarketChart(
        id,
        moment().subtract(3, 'month').startOf('month').unix(),
        moment().unix()
      )
      .subscribe(
        (res: any) => {},
        (error: any) => {}
      );
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'List' : '';
  }
}
