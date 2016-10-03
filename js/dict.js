var dbnary_query = "http://kaiko.getalp.org/sparql?default-graph-uri=&query=PREFIX+lexvo%3A+%3Chttp%3A%2F%2Flexvo.org%2Fid%2Fiso639-3%2F%3E%0D%0APREFIX+dbnary%3A+%3Chttp%3A%2F%2Fkaiko.getalp.org%2Fdbnary%23%3E%0D%0APREFIX+lemon%3A+%3Chttp%3A%2F%2Flemon-model.net%2Flemon%23%3E%0D%0ASELECT+%3Fe+WHERE+%7B+%0D%0A++%3Fe+lemon%3AcanonicalForm+%5Blemon%3AwrittenRep+%22{{lemma}}%22%40{{lang}}%5D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0"

var wordnet_query = "http://wordnet-rdf.princeton.edu/sparql/?query=PREFIX+lemon%3A+%3Chttp%3A%2F%2Flemon-model.net%2Flemon%23%3E+%0D%0A%0D%0Aselect+%3Fe+where+%7B%0D%0A+%3Fe+lemon%3AcanonicalForm+%5B+lemon%3AwrittenRep+%22{{lemma}}%22%40{{lang}}+%5D%0D%0A%7D+limit+10"

var babelnet_query = "http://babelnet.org/sparql/?query=SELECT+%3Fe+WHERE+%7B%0D%0A%3Fe+rdfs%3Alabel+%22{{lemma}}%22%40{{lang}}+%3B+a+lemon%3ALexicalEntry%0D%0A%7D+LIMIT+30&format=application%2Fsparql-results%2Bjson"

var dbpedia_query = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+%3Fe+%7B%0D%0A+%3Fe+rdfs%3Alabel+%22{{Lemma}}%22%40{{lang}}%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on"

var apertium_query = "http://linguistic.linkeddata.es/sparql/?default-graph-uri=&query=PREFIX+lemon%3A+%3Chttp%3A%2F%2Fwww.lemon-model.net%2Flemon%23%3E%0D%0Aselect+%3Fe+%7B+%3Fe+lemon%3AlexicalForm+%5B+lemon%3AwrittenRep+%22{{lemma}}%22%40{{lang}}+%5D+%7D&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"

$(function() {
    $('#search').on("submit", function(e) {
        e.preventDefault();
        var lemma = $('#lemma').val();
        var lang =  $('#lang').val();

        get_json_sparql(lemma, lang, dbnary_query, "dbnary");
        //get_json_sparql(lemma, lang, wordnet_query, "wordnet"); 
        get_json_sparql(lemma, lang, babelnet_query, "babelnet");
        get_json_sparql(lemma, lang, dbpedia_query, "dbpedia");
        get_json_sparql(lemma, lang, apertium_query, "apertium");

    });
})

function upper_first(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function get_json_sparql(lemma, lang, query, name) {
    var url = query.replace("{{lemma}}", lemma).replace("{{lang}}", lang).replace("{{Lemma}}", upper_first(lemma));
    $.ajax({ url:url, dataType:"jsonp", 
        success:function(data) {
        console.log(JSON.stringify(data));
        var bindings = data["results"]["bindings"];
        if(bindings.length > 0) {
            for(var i = 0; i < bindings.length; i++) {
               var binding = bindings[i];
               $('#' + name + '-ul').append("<li><a href='" + binding["e"]["value"] + "'>" + binding["e"]["value"] + "</li>");
            }
            $('#' + name + '-results').show();
        }
    }});
}
