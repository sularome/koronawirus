import React from 'react';
import Chart from 'chart.js';

class DeathsChart extends React.Component {
    constructor(props) {
        super(props);
        this.canvasElementRef = React.createRef();
    }
    componentDidMount() {
        this.chartData = {
            labels: [],
            datasets: [{
                label: 'liczba zgonów',
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 0, 0.9)',
                borderWidth: 1
            }, {
                label: 'wzrost',
                data: [],
                backgroundColor: 'rgba(99, 255, 132, 0.2)',
                borderColor: 'rgba(99, 255, 132, 1)',
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
        });
    }
    componentDidUpdate() {
        this.chartData.labels = this.props.regionData.map(stats => `${stats.date.getFullYear()}-${stats.date.getMonth() + 1}-${stats.date.getDate()}`);
        this.chartData.datasets[0].data = this.props.regionData.map(stats => stats.deaths);
        const change = [null];
        this.props.regionData.reduce((pv, stats) => {
            change.push(stats.deaths - pv.deaths);
            return stats;
        });
        this.chartData.datasets[1].data = change;
        this.chart.update();
    }
    render() {
        return <canvas ref={this.canvasElementRef} />;
    }
}

export default DeathsChart;