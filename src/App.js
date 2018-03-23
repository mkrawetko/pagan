import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {createDomain} from "./generators/domain/DomainGenerator";
import {convertToActionUnits} from "./generators/ActionUnitsConverter";


class PayloadForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "Please paste your payload here."
        }
    }

    handleChange(event) {
        let inputPayload = event.target.value;
        this.setState({value: inputPayload});
        let actionUnits = convertToActionUnits(inputPayload);
        console.log(actionUnits);

        let domain = createDomain(actionUnits);

        console.log(domain)
    }


    render() {
        return (
            <label>
                Payload:
                <textarea name="payloadForm" value={this.state.value}
                          onChange={event => this.handleChange(event)}/>
            </label>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to Payload Generator App</h1>
                </header>
                <p className="App-intro">
                    To get started, Paste your payload below.
                </p>
                <PayloadForm/>
            </div>
        );
    }
}

export default App;
