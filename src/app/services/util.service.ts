import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  networkStatus = true;

  // Use to identify the api loading state of the app
  public isLoading = new BehaviorSubject(false);

  // status code will be input
  // to show error pages based on status code like 500 , 502 etc
  errorComponent$: Subject<any> = new Subject();

  // Device offline , online status
  deviceNetworkStatus$: Subject<any> = new Subject();

  constructor(public toastController: ToastController) {}

  // To show error , success , warning message
  async showToastMessage(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
