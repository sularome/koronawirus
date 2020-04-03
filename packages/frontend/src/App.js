import React from 'react';
import './App.css';
import CountChart from './Chart/CountChart.js';
import DeathsChart from './Chart/DeathsChart.js';

const HOST = `https://koronawirus.herokuapp.com`;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        regionId: "",
        regionData: [],
        regions: [{ "id": "t02", "name": "dolnośląskie" }, { "id": "t04", "name": "kujawsko-pomorskie" }, { "id": "t06", "name": "lubelskie" }, { "id": "t08", "name": "lubuskie" }, { "id": "t10", "name": "łódzkie" }, { "id": "t12", "name": "małopolskie" }, { "id": "t14", "name": "mazowieckie" }, { "id": "t16", "name": "opolskie" }, { "id": "t18", "name": "podkarpackie" }, { "id": "t20", "name": "podlaskie" }, { "id": "t22", "name": "pomorskie" }, { "id": "t24", "name": "śląskie" }, { "id": "t26", "name": "świętokrzyskie" }, { "id": "t28", "name": "warmińsko-mazurskie" }, { "id": "t30", "name": "wielkopolskie" }, { "id": "t32", "name": "zachodniopomorskie" }]
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.regionId !== prevState.regionId) {
      this.fetchData();
    }
  }

  totalCount() {
    return Math.max(...this.state.regionData.map(region => region.count));
  }

  deathsCount() {
    return Math.max(...this.state.regionData.map(region => region.deaths));
  }
  
  onChangeRegion(e) {
    this.setState({regionId: e.target.value});
  }

  async fetchData() {
    let url = `${HOST}/total/`;
    if (this.state.regionId) {
        url += `${this.state.regionId}/`;
    }
    const response = await fetch(url);
    const data = await response.json();
    const regionData = data.map(stats => {
        return {
            date: new Date(stats._id),
            deaths: stats.deaths,
            count: stats.count
        }
    }).sort((a, b) => a.date.valueOf() - b.date.valueOf());
    this.setState({
      regionData: regionData
    });
  }
  render() {
    const regionOptions = this.state.regions.map(region => <option key={region.id} value={region.id}>{region.name}</option>);
    regionOptions.unshift(<option value="" key="t00" >Cała Polska</option>)
    return (
      <div className="App">
        <header>
          <h1 class="header-section">Koronawirus w Polsce</h1>
          <div class="header-section number-tiles">Total: {this.totalCount()}</div>
          <div class="header-section number-tiles">Deaths: {this.deathsCount()}</div>
          <div class="header-section">
            <select id="region" onChange={this.onChangeRegion.bind(this)} value={this.state.regionId}>
              {regionOptions}
            </select>
          </div>
        </header>
        <CountChart regionData={this.state.regionData} />
        <DeathsChart regionData={this.state.regionData} />
      </div>
    );
  }
}

export default App;
