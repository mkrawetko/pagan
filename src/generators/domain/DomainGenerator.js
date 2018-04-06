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

function createClass(builder, actionUnits) {

    let rootTagName = actionUnits[0].name;
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

function createDomain(actionUnits) {
    return createClass(new JavaClass.Builder(), actionUnits).build();
}


export {createDomain};