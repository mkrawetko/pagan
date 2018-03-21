import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


function parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}


class ActionUnit {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

function createClassProperties(actionUnits) {
    let builder = "";
    for (let i = 1; i < actionUnits.length; i++) {
        let property = actionUnits[i];
        builder += "\n\n    @JacksonXmlProperty" +
            "\n    public final String " + property.name + ";"

    }
    return builder;
}

function createConstructor(className, thisClassUnits) {
    let builder = "";
    builder += "\n\n    public " + className + "(";
    for (let i = 1; i < thisClassUnits.length; i++) {
        let unit = thisClassUnits[i];
        if (unit.path.includes("@")) {
            builder += "String " + unit.name + ","
        } else {
            builder += capitalizeFirstLetter(unit.name) + " " + unit.name + ",";
        }
    }
    builder = builder.slice(0, -1);
    builder += "){";
    for (let i = 1; i < thisClassUnits.length; i++) {
        let unit = thisClassUnits[i];
        builder += "\n        this.";
        builder += unit.name + "=" + unit.name + ";";
        if (!unit.path.includes("@")) {
            break;
        }
    }
    builder += "\n    }";
    return builder;
}

function createClass(actionUnits, classType = "") {
    let innerStaticClass = "";
    let nextClassIdx = actionUnits.slice(1).findIndex(unit => !unit.path.includes("@"));
    let thisClassUnits = actionUnits;
    if (nextClassIdx >= 0) {
        thisClassUnits = actionUnits.slice(0, nextClassIdx + 2);
        innerStaticClass = createClass(actionUnits.slice(nextClassIdx + 1));
    }

    let rootTagName = actionUnits[0].name;
    let className = capitalizeFirstLetter(rootTagName);
    let builder = "\n\n@JacksonXmlRootElement(localName = \"" + rootTagName + "\")";
    builder += "\npublic class " + classType + " " + className + " implements Serializable{";

    builder += createClassProperties(thisClassUnits);
    builder += createConstructor(className, thisClassUnits);

    builder += "\n" + innerStaticClass;
    builder += "\n}";
    return builder;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createDomain(actionUnits) {
    let builder = "package org.domain;";
    builder += "\n\nimport com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;" +
        "\nimport com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;";
    builder += createClass(actionUnits);

    return builder;
}

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
        let xml = parseXml(inputPayload);
        let tags = xml.getElementsByTagName('*');
        let actionUnits = [];
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            let nodeName = tag.nodeName;
            let tagPath = "/" + nodeName;
            actionUnits.push(new ActionUnit(nodeName, tagPath));
            for (let j = 0; j < tag.attributes.length; j++) {
                let attribute = tag.attributes[j];
                actionUnits.push(new ActionUnit(attribute.nodeName, tagPath + "/@" + attribute.nodeName))
            }
        }
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
