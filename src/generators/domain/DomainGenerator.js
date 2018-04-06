import {ClassDefinition, JavaClass} from "./JavaClass";


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

function createClass(builder, xml) {

    let parent = xml.childNodes[0];
    let rootTagName = parent.nodeName;

    for (let j = 0; j < parent.attributes.length; j++) {
        let attribute = tag.attributes[j];
        builder.withSimpleProperty(attribute.nodeName);
        // actionUnits.push(new ActionUnit(attribute.nodeName, tagPath + "/@" + attribute.nodeName))
    }
    if (parent.childNodes > 0)
        let tags = xml.getElementsByTagName('*');
    for (let i = 0; i < parent.childNodes.length; i++) {
        let tag = parent.childNodes[i];
        let nodeName = tag.nodeName;
        if (nodeName === "#text") {
            continue;
        }
        let tagPath = "/" + nodeName;
        // actionUnits.push(new ActionUnit(nodeName, tagPath));
        for (let j = 0; j < tag.attributes.length; j++) {
            let attribute = tag.attributes[j];
            builder.withSimpleProperty(attribute.nodeName);
            // actionUnits.push(new ActionUnit(attribute.nodeName, tagPath + "/@" + attribute.nodeName))
        }
    }

    builder.withName(rootTagName);
    for (let i = 1; i < actionUnits.length; i++) {
        let property = actionUnits[i];
        if (property.path.includes("@")) {
            builder.withSimpleProperty(property.name);
        } else {
            let clazz = createClass(new JavaClass.Builder(), actionUnits.splice(i)).build();
            builder.withObjectProperty(clazz);
            break;
        }
    }
    return builder;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createDomain(inputPayload) {


    return createClass(new JavaClass.Builder(), parseXml(inputPayload)).build();
}

function parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}


export {createDomain};