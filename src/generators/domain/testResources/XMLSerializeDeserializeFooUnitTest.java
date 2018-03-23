package com.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.hamcrest.Matchers;
import org.junit.Test;

import java.io.*;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;

public class XMLSerializeDeserializeFooUnitTest {

    private static String inputStreamToString(InputStream is) throws IOException {
        BufferedReader br;
        StringBuilder sb = new StringBuilder();

        String line;
        br = new BufferedReader(new InputStreamReader(is));
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }
        br.close();
        return sb.toString();
    }

    @Test
    public void whenJavaSerializedToXmlStr_thenCorrect() throws JsonProcessingException {
        XmlMapper xmlMapper = new XmlMapper();
        String xml = xmlMapper.writeValueAsString(new Foo("attr1Val1", new Foo.Boo("attr2Vall", "attr3val3", "boo value1")));
        assertNotNull(xml);
        assertThat(xml, Matchers.equalTo("<Foo attr1=\"attr1Val1\"><boo><attr2>attr2Vall</attr2><attr3>attr3val3</attr3><value>boo value1</value></boo></Foo>"));
    }

    @Test
    public void whenJavaSerializedToXmlFile_thenCorrect() throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.writeValue(new File("target/foo_bean.xml"), new Foo("attr1VAl", new Foo.Boo("attr2Val", "attr3Val", "boo value")));
        File file = new File("target/foo_bean.xml");
        assertNotNull(file);
    }


    @Test
    public void whenJavaGotFromXmlStr_thenCorrect() throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        Foo value = xmlMapper.readValue("<foo attr1=\"atr1Val\"><boo attr2=\"attr2Val\" attr3=\"attr3Val\">boo Value</boo></foo>", Foo.class);
        assertTrue(value.attr1.equals("atr1Val"));
        assertTrue(value.boo.attr2.equals("attr2Val"));
        assertTrue(value.boo.attr3.equals("attr3Val"));
        assertTrue(value.boo.value.equals("boo Value"));
    }

    @Test
    public void whenJavaGotFromXmlStrWithoutMandatoryAttr2_thenThrowException() throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        try {
            xmlMapper.readValue("<foo attr1=\"atr1Val\"><boo attr3=\"attr3Val\">boo Value</boo></foo>", Foo.class);
            fail("should throw exception");
        } catch (Exception ex) {
            assertThat(ex.getMessage(), Matchers.startsWith("Missing required creator property 'attr2' (index 0)"));
        }
    }

    @Test
    public void whenJavaGotFromXmlStrWithWrongRootTagName_thenCorrect() throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        Foo value = xmlMapper.readValue("<Foo1 attr1=\"atr1Val\"><boo attr2=\"attr2Val\" >boo Value</boo></Foo1>", Foo.class);
        assertTrue(value.attr1.equals("atr1Val"));
        assertTrue(value.boo.attr2.equals("attr2Val"));
        assertTrue(value.boo.attr3 == null);
        assertTrue(value.boo.value.equals("boo Value"));
    }

    @Test
    public void whenJavaGotFromXmlStrWithoutOptionalAttr_thenCorrect() throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        Foo value = xmlMapper.readValue("<foo attr1=\"atr1Val\"><boo attr2=\"attr2Val\" >boo Value</boo></foo>", Foo.class);
        assertTrue(value.attr1.equals("atr1Val"));
        assertTrue(value.boo.attr2.equals("attr2Val"));
        assertTrue(value.boo.attr3 == null);
        assertTrue(value.boo.value.equals("boo Value"));
    }

    @Test
    public void whenJavaGotFromXmlFile_thenCorrect() throws IOException {
        File file = new File("src/test/resources/foo_bean.xml");
        XmlMapper xmlMapper = new XmlMapper();
        String xml = inputStreamToString(new FileInputStream(file));
        Foo value = xmlMapper.readValue(xml, Foo.class);
        assertTrue(value.attr1.equals("atr1Val"));
        assertTrue(value.boo.attr2.equals("attr2Val"));
        assertTrue(value.boo.attr3.equals("attr3Val"));
        assertThat(value.boo.value, equalTo("        boo Value    "));
    }
}

