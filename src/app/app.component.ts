import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Subscription } from 'rxjs/internal/Subscription';
import { UtilService } from './services/util.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  constructor(
    private util: UtilService,
    private platform: Platform,
    public alertCtrl: AlertController,
    private router: Router
  ) {
    this.platform.ready().then(() => {
      if (!navigator.onLine) {
        this.util.networkStatus = false;
      } else {
        this.util.networkStatus = true;
      }
    });

    this.initializeBackButtonCustomHandler();

    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        console.log('Online...');
        this.util.showToastMessage('Device is online');
        this.util.networkStatus = true;
        this.util.deviceNetworkStatus$.next(true);
      })
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        this.util.showToastMessage('Connection lost! Device is offline');
        this.util.networkStatus = false;
        this.util.deviceNetworkStatus$.next(false);
        console.log('Offline...');
      })
    );
  }

  initializeBackButtonCustomHandler() {
    this.subscriptions.push(
      this.platform.backButton.subscribeWithPriority(999999, async () => {
        if (this.router.url.includes('details')) {
          this.router.navigateByUrl('/home');
        } else if (this.router.url === '/home') {
          const alert = await this.alertCtrl.create({
            header: 'Alert!',
            subHeader: '',
            message: 'Do you want to exit the app?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {},
              },
              {
                text: 'Yes',
                handler: () => {
                  // eslint-disable-next-line @typescript-eslint/dot-notation
                  navigator['app'].exitApp();
                },
              },
            ],
          });

          await alert.present();
        }
      })
    );
  }
}
