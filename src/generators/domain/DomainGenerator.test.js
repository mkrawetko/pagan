'use strict';
import 'jsdom-global/register'
import {createDomain, createJavaClassString} from "./DomainGenerator";

const chai = require('chai')
    , expect = chai.expect;


describe('Domain Generator', function () {

    describe('#generateDomain ', function () {

        const INPUT_PAYLOAD =
            "  <foo attr1=\"atr1Val\">\n" +
            "    <boo attr2=\"attr2Val\" attr3=\"attr3Val\">\n" +
            "        <innerboo innerbooAttr1=\"12\"/>\n" +
            "    </boo>\n" +
            "    <moo moo1=\"moo1Val\"/>\n" +
            "</foo>";

        it('should generate domain object', function () {

            let actual = createDomain(INPUT_PAYLOAD);
            console.log(actual);
            expect(actual.name).to.equal("foo");
            expect(actual.simpleProperties.length).to.equal(1);
            expect(actual.simpleProperties[0]).to.equal("attr1");
            expect(actual.objectProperties.length).to.equal(2);

            let booProperty = actual.objectProperties[0];
            expect(booProperty.name).to.equal("boo");
            expect(booProperty.simpleProperties.length).to.equal(2);
            expect(booProperty.simpleProperties[0]).to.equal("attr2");
            expect(booProperty.simpleProperties[1]).to.equal("attr3");
            expect(booProperty.objectProperties.length).to.equal(1);

            let innerBoo = booProperty.objectProperties[0];
            expect(innerBoo.name).to.equal("innerboo");
            expect(innerBoo.simpleProperties.length).to.equal(1);
            expect(innerBoo.simpleProperties[0]).to.equal("innerbooAttr1");
            expect(innerBoo.objectProperties.length).to.equal(0);

            let mooProperty = actual.objectProperties[1];
            expect(mooProperty.name).to.equal("moo");
            expect(mooProperty.simpleProperties.length).to.equal(1);
            expect(mooProperty.simpleProperties[0]).to.equal("moo1");
            expect(mooProperty.objectProperties.length).to.equal(0);

        });

        it('should generate valid java class string', function () {

            let actual = createJavaClassString(INPUT_PAYLOAD);
            console.log(actual);

            expect(actual).to.equal(
                "package org.domain;\n" +
                "\n" +
                "import com.fasterxml.jackson.annotation.JsonCreator;\n" +
                "import com.fasterxml.jackson.annotation.JsonProperty;\n" +
                "import com.fasterxml.jackson.annotation.JsonRootName;\n" +
                "import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;\n" +
                "\n" +
                "@JsonRootName(\"foo\")\n" +
                "public class Foo {\n" +
                "\n" +
                "    public final String attr1;\n" +
                "\n" +
                "    public final Boo boo;\n" +
                "\n" +
                "    @JsonCreator\n" +
                "    public Foo(@JsonProperty(value = \"attr1\") String attr1, @JsonProperty(\"boo\") Boo boo) {\n" +
                "        this.attr1 = attr1;\n" +
                "        this.boo = boo;\n" +
                "    }\n" +
                "\n" +
                "\n" +
                "    public static class Boo {\n" +
                "\n" +
                "        public final String attr2;\n" +
                "\n" +
                "        public final String attr3;\n" +
                "        public final String value;\n" +
                "\n" +
                "        @JsonCreator\n" +
                "        public Boo(@JsonProperty(value = \"attr2\", required = true) String attr2, @JsonProperty(value = \"attr3\") String attr3, @JacksonXmlProperty String value) {\n" +
                "            this.attr2 = attr2;\n" +
                "            this.attr3 = attr3;\n" +
                "            this.value = value;\n" +
                "        }\n" +
                "    }\n" +
                "}\n")

        });

    });


});