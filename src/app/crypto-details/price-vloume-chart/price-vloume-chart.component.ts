import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-price-vloume-chart',
  templateUrl: './price-vloume-chart.component.html',
  styleUrls: ['./price-vloume-chart.component.scss'],
})
export class PriceVloumeChartComponent implements OnInit {
  @Input() volumeData: any;
  @Input() priceData: any;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const dateArray = [];
    const priceArray = [];
    const volumeArray = [];
    for(const element of this.volumeData) {
      dateArray.push(element[0]);
      volumeArray.push(element[1]);
    }
    for(const element of this.priceData) {
      priceArray.push(element[1]);
    }

    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      xAxis: [
        {
          type: 'Date',
          data: dateArray,
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

    option && myChart.setOption(option);
  }
  onResize(e) {}
}
