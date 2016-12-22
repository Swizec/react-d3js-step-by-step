import React, { Component } from 'react';


import Preloader from './components/Preloader';

class App extends Component {
    state = {
        techSalaries: []
    }

    render() {
        if (this.state.techSalaries.length < 1) {
            return (
                <Preloader />
            );
        }

        return (
            <div className="App">

            </div>
        );
    }
}

export default App;
