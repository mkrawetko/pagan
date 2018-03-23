'use strict';
import 'jsdom-global/register'
import {convertToActionUnits} from "../ActionUnitsConverter";
import {createDomain} from "./DomainGenerator";

const chai = require('chai')
    , expect = chai.expect;


describe('Domain Generator', function () {

    describe('#generateDomain ', function () {

        const INPUT_PAYLOAD =
            "<foo attr1=\"atr1Val\">\n" +
            "    <boo attr2=\"attr2Val\" attr3=\"attr3Val\">\n" +
            "        boo Value\n" +
            "    </boo>\n" +
            "</foo>";

        const INPUT_ACTION_UNITS = convertToActionUnits(INPUT_PAYLOAD);

        it('should generate domain', function () {

            return expect(createDomain(INPUT_ACTION_UNITS)).to.equal(
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