// Algorithm based on an implementation by Havel Cyrus (2015).
(function(window) {

  function TextRank() {
    /**
     *
     */
    function levenshtein(s, t) {
      var n = s.length, m = t.length;
      if (n === 0) return m;
      if (m === 0) return n;
      var d = [], i, j;
      // Allocate.
      for (i = n; i >= 0; i--) d[i] = [];
      for (i = n; i >= 0; i--) d[i][0] = i;
      for (j = m; j >= 0; j--) d[0][j] = j;
      // Fill in the rest of the matrix.
      for (i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
          // Check the jagged ld total so far.
          if (i == j && d[i][j] > 4) return n;
          var t_j = t.charAt(j - 1);
          var cost = (s_i == t_j) ? 0 : 1;
          // Calculate the minimum.
          var mi = d[i - 1][j] + 1;
          var b = d[i][j - 1] + 1;
          var c = d[i - 1][j - 1] + cost;
          if (b < mi) mi = b;
          if (c < mi) mi = c;
          d[i][j] = mi;
          // Damerau transposition.
          //if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
          //  d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
          //}
        }
      }
      return d[n][m];
    };
    /**
     *
     */
    function getSimilarityGraph(sentences) {
      var graph = new Array();
      for(s in sentences) {
        var sentenceSimilarity = new Array();
        for(t in sentences) {
          sentenceSimilarity.push(levenshtein(sentences[s], sentences[t]));
        }
        graph.push(sentenceSimilarity);
      }
      return graph;
    };
    /**
     *
     */
    function getTextRank(graph) {
      return new PageRank(graph, 0.85, 0.0001, function(err, res) {
        if (err) throw new Error(err);
      });
    };
    /**
     *
     */
    function getSelectedIndex(textRank, max) {
      var sortedIndex = new Array();
      var selectedIndex = new Array();
      var sortedRank = textRank.sort();

      for(var i = 1; i <= max; i++) {
        sortedIndex.push(sortedRank[sortedRank.length - i]);
      }
      for(var i = 0; i < max; i++) {
        for(var j = 0; j < textRank.length; j++) {
          if(sortedIndex[i] == textRank[j]) {
            var duplicate = false;
            if(selectedIndex.length > 0) {
              for(k in selectedIndex) {
                if(selectedIndex[k] == j) {
                  duplicate = true;
                  break;
                }
              }
              if(!duplicate) selectedIndex.push(j);
              else continue;
            } else {
              selectedIndex.push(j);
            }
            break;
          }
        }
      }
      return selectedIndex;
    };
    /**
     *
     */
    function summarize(sentences, count) {
      var similarityGraph = getSimilarityGraph(sentences);
      var textRank = getTextRank(similarityGraph).probabilityNodes;
      var selectedIndex = getSelectedIndex(textRank, count);
      var rank = [];
      for (i in selectedIndex) {
        for (s in sentences) {
          if (selectedIndex[i] == s) {
            rank.push(sentences[s]);
          }
        }
      }
      return rank;
    };

    // Expose public API.
    return {
      summarize: summarize,
    }
    
  };

  // Finally expose module.
  window.TextRank = new TextRank();

})(this);
