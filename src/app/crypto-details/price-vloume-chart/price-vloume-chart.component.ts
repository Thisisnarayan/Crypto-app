import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import * as moment from 'moment';

@Component({
  selector: 'app-price-vloume-chart',
  templateUrl: './price-vloume-chart.component.html',
  styleUrls: ['./price-vloume-chart.component.scss'],
})
export class PriceVloumeChartComponent implements OnInit {
  // property to hold volume data with date
  @Input() volumeData: any;

  // property to hold price data with date
  @Input() priceData: any;
  moment = moment;
  selected = 3;
  chart: any;
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    grid: {
      left: '3%',
      bottom: '15%',
      right: '2%',
      top: '2%',
    },
    dataZoom: [
      {
        start: 0,
        end: 100,
        filterMode: 'empty',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: [],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        show: false,
      },
      {
        type: 'value',
        name: '',
        show: false,
        interval: 5,
      },
    ],
    series: [
      {
        name: 'Volume',
        type: 'bar',
        data: [],
      },
      {
        name: 'Price',
        type: 'line',
        yAxisIndex: 1,
        data: [],
      },
    ],
  };
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const dateArray = [];
    const priceArray = [];
    const volumeArray = [];
    for (const element of this.volumeData) {
      dateArray.push(moment(element[0]).format('DD/MM'));
      volumeArray.push(Number(element[1]).toFixed(0));
    }
    for (const element of this.priceData) {
      priceArray.push(Number(element[1]).toFixed(2));
    }

    const chartDom = document.getElementById('main');
    this.chart = echarts.init(chartDom);
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    this.option.xAxis[0].data = dateArray;
    this.option.series[0].data = volumeArray;
    this.option.series[1].data = priceArray;
    this.option && this.chart.setOption(this.option);
  }

  /**
   * Update grapgh based on start and end data , search within 3 month data.
   *
   * @param  start Date in unix timestamp.
   * @param  end Date in unix timestamp.
   * @param  index number to identified applied filter type 1 - Last week , 2- Last Month , 3- last 3 month.
   */
  dateFilter(start, end, index) {
    const dateArray = [];
    const priceArray = [];
    const volumeArray = [];
    for (const element of this.volumeData) {
      if (this.isBetween(element[0], start, end)) {
        dateArray.push(moment(element[0]).format('DD/MM'));
        volumeArray.push(Number(element[1]).toFixed(0));
      }
    }
    for (const element of this.priceData) {
      if (this.isBetween(element[0], start, end)) {
        priceArray.push(Number(element[1]).toFixed(2));
      }
    }
    const newOption = {
      ...this.option,
      xAxis: [
        {
          type: 'category',
          data: dateArray,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          data: volumeArray,
        },
        {
          name: 'Price',
          type: 'line',
          yAxisIndex: 1,
          data: priceArray,
        },
      ],
    };
    this.chart.setOption(newOption, true);
    this.selected = index;
  }

  /**
   * Return if given number is persent between two number.
   *
   * @param  n number to be present between given numbers.
   * @param  a first number.
   * @param  b second number.
   * @return boolean / true or false.
   *
   */
  isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
  }

}
