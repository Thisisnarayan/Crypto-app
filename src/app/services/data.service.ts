/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../CONSTANTS';

export interface CryptoList {
  id: string;
  symbol: string;
  name: string;
  price: number;
  description: string;
}

export interface price {
  inr: number;
  usd: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  httpOptions: any = {};
  cryptolist: CryptoList[] = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      price: null,
      description: '',
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      price: null,
      description: '',
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      price: null,
      description: '',
    },
    {
      id: 'metal',
      symbol: 'mtl',
      name: 'Metal',
      price: null,
      description: '',
    },
    {
      id: 'digibyte',
      symbol: 'dgb',
      name: 'DigiByte',
      price: null,
      description: '',
    },
    {
      id: 'matic-network',
      symbol: 'matic',
      name: 'Polygon',
      price: null,
      description: '',
    },
    {
      id: 'district0x',
      symbol: 'dnt',
      name: 'district0x',
      price: null,
      description: '',
    },
    {
      id: 'chiliz',
      symbol: 'chz',
      name: 'Chiliz',
      price: null,
      description: '',
    },
    {
      id: 'dash',
      symbol: 'dash',
      name: 'Dash',
      price: null,
      description: '',
    },
    {
      id: 'binance-peg-litecoin',
      symbol: 'ltc',
      name: 'Binance-Peg Litecoin',
      price: null,
      description: '',
    },
    {
      id: 'addax',
      symbol: 'adx',
      name: 'Addax',
      price: null,
      description: '',
    },
    {
      id: 'addict-finance',
      symbol: 'addict',
      name: 'Addict Finance',
      price: null,
      description: '',
    },
    {
      id: 'add-xyz-new',
      symbol: 'add',
      name: 'Add.xyz (NEW)',
      price: null,
      description: '',
    },
    {
      id: 'adelphoi',
      symbol: 'adl',
      name: 'Adelphoi',
      price: null,
      description: '',
    },
    {
      id: '1x-short-eos-token',
      symbol: 'eoshedge',
      name: '1X Short EOS Token',
      price: null,
      description: '',
    },
    {
      id: 'zent-cash',
      symbol: 'ztc',
      name: 'Zent Cash',
      price: null,
      description: '',
    },
    {
      id: 'alchemix-eth',
      symbol: 'aleth',
      name: 'Alchemix ETH',
      price: null,
      description: '',
    },
    {
      id: 'birdchain',
      symbol: 'bird',
      name: 'Birdchain',
      price: null,
      description: '',
    },
    {
      id: 'bishoku-inu',
      symbol: 'bishoku',
      name: 'Bishoku Inu',
      price: null,
      description: '',
    },
    {
      id: 'angryb',
      symbol: 'anb',
      name: 'Angryb',
      price: null,
      description: '',
    },
    {
      id: '1x-short-ethereum-token',
      symbol: 'ethhedge',
      name: '1X Short Ethereum Token',
      price: null,
      description: '',
    },
    {
      id: '1x-short-exchange-token-index-token',
      symbol: 'exchhedge',
      name: '1X Short Index Token',
      price: null,
      description: '',
    },
    {
      id: '420x',
      symbol: '420x',
      name: '420x',
      price: null,
      description: '',
    },
    {
      id: '42-coin',
      symbol: '42',
      name: '42-coin',
      price: null,
      description: '',
    },
    {
      id: 'ztcoin',
      symbol: 'zt',
      name: 'ZBG Token',
      price: null,
      description: '',
    },
    {
      id: 'allive',
      symbol: 'alv',
      name: 'Allive',
      price: null,
      description: '',
    },
  ];

  cryptoListDataMap = new Map<string, any>();
  constructor(private http: HttpClient) {}

  public getCryptoList(): CryptoList[] {
    return this.cryptolist;
  }

  public getCryptoSimplePrice(ids, currencies): Observable<any> {
    return this.http.get(
      `${CONSTANTS.serverurl}/api/v3/simple/price?ids=${ids}&vs_currencies=${currencies}`,
      (this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
    );
  }

  public getCryptoMetaData(id): Observable<any> {
    return this.http.get(
      `${CONSTANTS.serverurl}/api/v3/coins/${id}?localization=false&tickers=false&market_data=
      true&community_data=false&developer_data=false&sparkline=false`,
      (this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
    );
  }

  public metaUpdate(id) {
    return new Promise((resolve, reject) => {
      this.getCryptoMetaData(id).subscribe((res) => {
        resolve(res);
      });
    });
  }

  public getMarketChart(id,from,to): Observable<any> {
    return this.http.get(
      `${CONSTANTS.serverurl}/api/v3/coins/${id}/market_chart/range?vs_currency=inr&from=${from}&to=${to}`,
      (this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
    );
  }

  // https://api.coingecko.com/api/v3/ping
  // /v1/cryptocurrency/category
  // /v1/cryptocurrency/quotes/historical

  // /v1/cryptocurrency/quotes/latest --- can use
  // symbol=BTC,ETH
  // id=1,1027
  // /cryptocurrency/listings/latest
  // /exchange/map
  // /v1/exchange/quotes/historical
}
