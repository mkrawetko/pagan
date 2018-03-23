function createClassProperties(actionUnits) {
    let builder = "";
    for (let i = 1; i < actionUnits.length; i++) {
        let property = actionUnits[i];
        builder += "\n\n    @JacksonXmlProperty";
        builder += "\n    ";
        if (property.path.includes("@")) {
            builder += "String " + property.name + ";"
        } else {
            builder += capitalizeFirstLetter(property.name) + " " + property.name + ";";
        }
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

export {createDomain};