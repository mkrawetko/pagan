import {JavaClass} from "./JavaClass";


function createClass(builder, parent) {

    builder.withName(parent.nodeName);

    for (let j = 0; j < parent.attributes.length; j++) {
        builder.withSimpleProperty(parent.attributes[j].nodeName);
    }

    for (let c = 0; c < parent.childNodes.length; c++) {
        let node = parent.childNodes[c];
        if (node.nodeName !== "#text") {
            builder.withObjectProperty(createClass(new JavaClass.Builder(), node))
        }
    }

    return builder;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createDomain(inputPayload) {
    return createClass(new JavaClass.Builder(), parseXml(inputPayload).childNodes[0]).build();
}

function createJavaClassString(inputPayload) {
    let domain = createDomain(inputPayload);
    let classStr = "package org.domain;";
    classStr += "\n";
    classStr += "import com.fasterxml.jackson.annotation.JsonCreator;" +
        "\n" +
        "import com.fasterxml.jackson.annotation.JsonProperty;" +
        "\n" +
        "import com.fasterxml.jackson.annotation.JsonRootName;" +
        "\n" +
        "import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;";
    classStr += "\n";
    classStr += "\n";
    classStr += "@JsonRootName(\"" + domain.name + "\")";
    classStr += "\n";
    classStr += "public class " + capitalizeFirstLetter(domain.name) + " {";
    classStr += "\n";
    classStr += "\n";
    domain.simpleProperties.forEach(property => {
        classStr += "    public final String" + property + ";";
        classStr += "\n";
    });
    domain.objectProperties.forEach(property => {
        classStr += "    public final " + capitalizeFirstLetter(property.name) + " " + property.name + ";";
        classStr += "\n";
    });

    return classStr;
}

function parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}


export {createDomain, createJavaClassString};