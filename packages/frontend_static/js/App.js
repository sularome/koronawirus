(function () {
    const regionData = [{ "id": "t02", "name": "dolnośląskie" }, { "id": "t04", "name": "kujawsko-pomorskie" }, { "id": "t06", "name": "lubelskie" }, { "id": "t08", "name": "lubuskie" }, { "id": "t10", "name": "łódzkie" }, { "id": "t12", "name": "małopolskie" }, { "id": "t14", "name": "mazowieckie" }, { "id": "t16", "name": "opolskie" }, { "id": "t18", "name": "podkarpackie" }, { "id": "t20", "name": "podlaskie" }, { "id": "t22", "name": "pomorskie" }, { "id": "t24", "name": "śląskie" }, { "id": "t26", "name": "świętokrzyskie" }, { "id": "t28", "name": "warmińsko-mazurskie" }, { "id": "t30", "name": "wielkopolskie" }, { "id": "t32", "name": "zachodniopomorskie" }];

    document.addEventListener("DOMContentLoaded", async () => {
        const rootElement = document.getElementById(`app`);
        let state = {
            regionId: "",
            regionData: []
        };
        state.regionData = await fetchData(state.regionId);
        render();

        function render() {
            const elements = setupElements();
            renderCount(elements.countCanvas);
            renderDeaths(elements.deathsCanvas);
        }

        function renderCount(canvas) {
            const change = [null];
            state.regionData.reduce((pv, stats) => {
                change.push(stats.count - pv.count);
                return stats;
            });
            const myChart = new Chart(canvas.getContext("2d"), {
                type: 'line',
                data: {
                    labels: state.regionData.map(stats => `${stats.date.getFullYear()}-${stats.date.getMonth() + 1}-${stats.date.getDate()}`),
                    datasets: [{
                        label: 'liczba zachorowań',
                        data: state.regionData.map(stats => stats.count),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-1'
                    }, {
                        label: 'wzrost',
                        data: change,
                        backgroundColor: 'rgba(132, 99, 255, 0.2)',
                        borderColor: 'rgba(132, 99, 255, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-2'
                    }]
                },
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

        function renderDeaths(canvas) {
            const change = [null];
            state.regionData.reduce((pv, stats) => {
                change.push(stats.deaths - pv.deaths);
                return stats;
            });
            const myChart = new Chart(canvas.getContext("2d"), {
                type: 'line',
                data: {
                    labels: state.regionData.map(stats => `${stats.date.getFullYear()}-${stats.date.getMonth() + 1}-${stats.date.getDate()}`),
                    datasets: [{
                        label: 'liczba zgonów',
                        data: state.regionData.map(stats => stats.deaths),
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderColor: 'rgba(0, 0, 0, 0.9)',
                        borderWidth: 1
                    }, {
                        label: 'wzrost',
                        data: change,
                        backgroundColor: 'rgba(99, 255, 132, 0.2)',
                        borderColor: 'rgba(99, 255, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-2'
                    }]
                },
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

        function setupElements() {
            rootElement.innerHTML = "";
            const selectFilter = document.createElement(`select`);
            const option = document.createElement(`option`);
            option.value = "";
            option.innerText = "Cała Polska";
            selectFilter.appendChild(option);
            regionData.forEach(region => {
                const option = document.createElement(`option`);
                option.value = region.id;
                option.innerText = region.name;
                selectFilter.appendChild(option);
            });
            selectFilter.value = state.regionId;
            selectFilter.addEventListener(`change`, async () => {
                state.regionId = selectFilter.value;
                state.regionData = await fetchData(state.regionId);
                render();
            });
            rootElement.appendChild(selectFilter);
            const countCanvas = document.createElement(`canvas`);
            countCanvas.setAttribute(`width`, 400);
            countCanvas.setAttribute(`height`, 100);
            rootElement.appendChild(countCanvas);
            const deathsCanvas = document.createElement(`canvas`);
            deathsCanvas.setAttribute(`width`, 400);
            deathsCanvas.setAttribute(`height`, 100);
            rootElement.appendChild(deathsCanvas);
            return {
                countCanvas,
                deathsCanvas
            }
        }

        async function fetchData(regionId) {
            let url = `https://koronawirus.herokuapp.com/total/`;
            if (regionId) {
                url += `${regionId}/`;
            }
            const response = await fetch(url);
            const data = await response.json();
            return data.map(stats => {
                return {
                    date: new Date(stats._id),
                    deaths: stats.deaths,
                    count: stats.count
                }
            }).sort((a, b) => a.date.valueOf() - b.date.valueOf());
        }
    });
})();