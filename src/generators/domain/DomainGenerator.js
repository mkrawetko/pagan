import {ClassDefinition, JavaClass} from "./JavaClass";

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

function createClass(builder, actionUnits, classType = "") {
    let innerStaticClass = "";
    let thisClassUnits = actionUnits;
    // let nextClassIdx = actionUnits.slice(1).findIndex(unit => !unit.path.includes("@"));
    // if (nextClassIdx >= 0) {
    //     thisClassUnits = actionUnits.slice(0, nextClassIdx + 2);
    //     innerStaticClass = createClass(actionUnits.slice(nextClassIdx + 1));
    // }

    let rootTagName = actionUnits[0].name;
    let className = capitalizeFirstLetter(rootTagName);
    let classDefinition = new ClassDefinition.Builder()
        .withName(className);
    classDefinition.withAnnotation("@JsonRootName(\"" + rootTagName + "\")");
    if (classType !== "") {
        classDefinition.withStaticModifier();
    }
    // builder += "\npublic class " + classType + " " + className + " implements Serializable{";

    for (let i = 1; i < actionUnits.length; i++) {
        let property = actionUnits[i];
        builder += "\n\n    @JacksonXmlProperty";
        builder += "\n    ";
        if (property.path.includes("@")) {
            builder.withSimpleProperty(property.name);
        } else {
            builder.withObjectProperty(property.name);
            builder += capitalizeFirstLetter(property.name) + " " + property.name + ";";
        }
    }

    // builder += createClassProperties(thisClassUnits);
    // builder += createConstructor(className, thisClassUnits);

    // builder += "\n" + innerStaticClass;
    // builder += "\n}";
    // return builder;
    builder.withClassDefinition(classDefinition.build());
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createDomain(actionUnits) {
    let builder = new JavaClass.Builder().withPackage("org.domain");
    //
    // let builder = "package org.domain;";
    // builder += "\n\nimport com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;" +
    //     "\nimport com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;";
    // builder += createClass(actionUnits);
    //
    // return builder;
    builder.withImport("com.fasterxml.jackson.annotation.JsonCreator")
        .withImport("com.fasterxml.jackson.annotation.JsonProperty")
        .withImport("com.fasterxml.jackson.annotation.JsonRootName")
        .withImport("com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty");

    createClass(builder, actionUnits);
    return builder.build();
}


export {createDomain};