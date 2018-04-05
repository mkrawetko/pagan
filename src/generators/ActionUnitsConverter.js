function parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}

class ActionUnit {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

function convertToActionUnits(inputPayload) {
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
    return actionUnits;
}


export {convertToActionUnits}