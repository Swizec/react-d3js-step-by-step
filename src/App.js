import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import Preloader from './components/Preloader';
import { loadAllData } from './DataHandling';

import CountyMap from './components/CountyMap';

class App extends Component {
    state = {
        techSalaries: [],
        countyNames: [],
        medianIncomes: []
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
                <svg width="1100" height="500">
                    <CountyMap usTopoJson={this.state.usTopoJson}
                               USstateNames={this.state.USstateNames}
                               values={countyValues}
                               x={0}
                               y={0}
                               width={500}
                               height={500}
                               zoom={zoom} />
                </svg>
            </div>
        );
    }
}

export default App;
