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
    return createClass(new JavaClass.Builder(), parseXml(inputPayload).childNodes[0]).build();
}

function parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}


export {createDomain,createJavaClassString};