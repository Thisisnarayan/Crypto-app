import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, Subject, of } from 'rxjs';
import { catchError , tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UtilService } from './services/util.service';
import {CONSTANTS} from './CONSTANTS';
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  authService;
  refreshTokenInProgress = false;
  private urlCache = new Map<string, any>();
  constructor(private router: Router,
    private utilService: UtilService) {}

  addAuthHeader(request) {
      return request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-CMC_PRO_API_KEY': `${CONSTANTS.key}`,
        },
      });
    return request;
  }



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // addng auth key to every request

    // Not required for coingecko apis
    //req = this.addAuthHeader(req);

    // method for cache data based on url
    const cachedResponse = this.urlCache.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    // console.log('Req started');
    this.utilService.isLoading.next(true);

    return next.handle(req).pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // cache get request by url
          this.utilService.isLoading.next(false);
          // if (this.checkUrlNeedTOCacheOrNot(req.url)) {
          //   this.urlCache.set(req.url, event);
          // }
        }
      },
      (err: any) => {
        let error;
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          const status: number = err.status;
          switch (status) {
            case 401:
              //  alert('token expired');
              localStorage.clear();
              this.utilService.isLoading.next(false);
              this.utilService.showToastMessage('Alert!','API key missing.','red');
              break;
            case 403: // forbidden
              this.utilService.showToastMessage('Alert!',
              `Your API Key subscription plan doesn't support this endpoint.`,
              'red');
              break;
            case 500:
              this.utilService.isLoading.next(false);
              this.utilService.showToastMessage('Alert!','Internal Server Error! Something bad happened.','red');
              this.utilService.errorComponent$.next(500);
              break;
            case 503:
              // 503 Service Unavailable
              this.utilService.isLoading.next(false);
              this.utilService.showToastMessage('Alert!','Service Unavailable.','red');
              break;
            case 404:
              // window.location.href = result;
              break;
            case 502:
              this.utilService.errorComponent$.next(502);
              break;
            case 429:
                // too many requests
                this.utilService.errorComponent$.next(429);
                this.utilService.showToastMessage('Alert!',
                `You've exceeded your API Key's HTTP request rate limit. Rate limits reset every minute.`,
                'red');
                break;
            case 504:
              this.utilService.isLoading.next(false);
              this.utilService.showToastMessage('Alert!',`your're offline check your connection and try again.`,'red');
              this.utilService.errorComponent$.next(504);
              // network retry page
              break;
            // your're offline check your connection and try again.
          }
        }
      }, () => {
        // console.log('Req ended');
        this.utilService.isLoading.next(false);
      }));
  }
  // checkUrlNeedTOCacheOrNot(url) {
  //   if (url === `${CONSTANTS.serverurl}/`) {
  //     return true;
  //   }
  // }
}
