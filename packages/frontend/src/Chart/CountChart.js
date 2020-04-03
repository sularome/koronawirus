import React from 'react';
import Chart from 'chart.js';

class CountChart extends React.Component {
    constructor(props) {
        super(props);
        this.canvasElementRef = React.createRef();
    }
    componentDidMount() {
        this.chartData = {
            labels: [],
            datasets: [{
                label: 'liczba zachorowań',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-1'
            }, {
                label: 'wzrost',
                data: [],
                backgroundColor: 'rgba(132, 99, 255, 0.2)',
                borderColor: 'rgba(132, 99, 255, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-2'
            }]
        };
        this.chart = new Chart(this.canvasElementRef.current, {
            type: 'line',
            data: this.chartData,
            options: {
                scales: {
                    yAxes: [{
                        type: 'linear',
                        beginAtZero: true,
                        position: 'left',
                        id: 'y-axis-1',

                    }, {
                        type: 'linear',
                        beginAtZero: true,
                        position: 'right',
                        id: 'y-axis-2',

                    }]
                }
            }
        })
    }
    componentDidUpdate() {
        this.chartData.labels = this.props.regionData.map(stats => `${stats.date.getFullYear()}-${stats.date.getMonth() + 1}-${stats.date.getDate()}`);
        this.chartData.datasets[0].data = this.props.regionData.map(stats => stats.count);
        const change = [null];
        this.props.regionData.reduce((pv, stats) => {
            change.push(stats.count - pv.count);
            return stats;
        });
        this.chartData.datasets[1].data = change;
        this.chart.update();
    }
    render() {
        return <canvas ref={this.canvasElementRef} />;
    }
}

export default CountChart;