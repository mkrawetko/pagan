class JavaClass {
    constructor(build) {
        this.name = build.name;
        this.simpleProperties = build.simpleProperties;
        this.objectProperties = build.objectProperties;
    }


    static get Builder() {
        class Builder {
            constructor() {
                this.simpleProperties = [];
                this.objectProperties = [];
            }

            withName(value) {
                this.name = value;
                return this;
            }

            withSimpleProperty(name) {
                this.simpleProperties.push(name)
            }

            withObjectProperty(name) {
                this.objectProperties.push(name)
            }

            build() {
                return new JavaClass(this)
            }
        }

        return Builder;
    }


}

export {JavaClass}