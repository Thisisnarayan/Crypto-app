import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Subscription } from 'rxjs/internal/Subscription';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  constructor(private util: UtilService) {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(
      this.onlineEvent.subscribe(e => {
        console.log('Online...');
        this.util.showToastMessage('','Device is online','#f0f0f0');
        this.util.networkStatus = true;
        this.util.deviceNetworkStatus$.next(true);
      }),
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe(e => {
        this.util.showToastMessage('','Connection lost! Device is offline','#f0f0f0');
        this.util.networkStatus = false;
        this.util.deviceNetworkStatus$.next(false);
        console.log('Offline...');
      }),
    );
  }
}
