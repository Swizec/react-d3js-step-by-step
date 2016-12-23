import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import './App.css';

import Preloader from './components/Preloader';
import { loadAllData } from './DataHandling';

import CountyMap from './components/CountyMap';
import Histogram from './components/Histogram';
import { Title, Description, GraphDescription } from './components/Meta';

class App extends Component {
    state = {
        techSalaries: [],
        countyNames: [],
        medianIncomes: [],
        filteredBy: {
            USstate: '*',
            year: '*',
            jobTitle: '*'
        }
    }

    componentWillMount() {
        loadAllData(data => this.setState(data));
    }

    countyValue(county, techSalariesMap) {
        const medianHousehold = this.state.medianIncomes[county.id],
              salaries = techSalariesMap[county.name];

        if (!medianHousehold || !salaries) {
            return null;
        }

        const median = d3.median(salaries, d => d.base_salary);

        return {
            countyID: county.id,
            value: median - medianHousehold.medianIncome
        };
    }

    render() {
        if (this.state.techSalaries.length < 1) {
            return (
                <Preloader />
            );
        }

        const filteredSalaries = this.state.techSalaries,
              filteredSalariesMap = _.groupBy(filteredSalaries, 'countyID'),
              countyValues = this.state.countyNames.map(
                  county => this.countyValue(county, filteredSalariesMap)
              ).filter(d => !_.isNull(d));

        let zoom = null;

        return (
            <div className="App container">
                <Title data={filteredSalaries} filteredBy={this.state.filteredBy} />
                <Description data={filteredSalaries}
                             allData={this.state.techSalaries}
                             medianIncomesByCounty={this.state.medianIncomesByCounty}
                             filteredBy={this.state.filteredBy} />

                <GraphDescription data={filteredSalaries}
                                  filteredBy={this.state.filteredBy} />

                <svg width="1100" height="500">
                    <CountyMap usTopoJson={this.state.usTopoJson}
                               USstateNames={this.state.USstateNames}
                               values={countyValues}
                               x={0}
                               y={0}
                               width={500}
                               height={500}
                               zoom={zoom} />

                    <Histogram bins={10}
                               width={500}
                               height={500}
                               x="500"
                               y="10"
                               data={filteredSalaries}
                               axisMargin={83}
                               bottomMargin={5}
                               value={d => d.base_salary} />
                </svg>
            </div>
        );
    }
}

export default App;
