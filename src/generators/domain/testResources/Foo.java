package com.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JsonRootName("foo")
public class Foo {

    public final String attr1;

    public final Boo boo;

    @JsonCreator
    public Foo(@JsonProperty(value = "attr1") String attr1, @JsonProperty("boo") Boo boo) {
        this.attr1 = attr1;
        this.boo = boo;
    }


    public static class Boo {

        public final String attr2;

        public final String attr3;
        public final String value;

        @JsonCreator
        public Boo(@JsonProperty(value = "attr2", required = true) String attr2, @JsonProperty(value = "attr3") String attr3, @JacksonXmlProperty String value) {
            this.attr2 = attr2;
            this.attr3 = attr3;
            this.value = value;
        }
    }
}
