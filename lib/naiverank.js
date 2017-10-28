(function(window) {

  var document = window.document;

  function NaiveRank() {
    /**
     * Sort object values.
     * @param {object} obj An object to sort values from.
     * @returns {Array} array of items in [[key,value],[key,value],...] format.
     */
    function sortObject(obj) {
      var sortable = [];
      for (var key in obj)
        if (obj.hasOwnProperty(key))
          sortable.push([ key, obj[key] ]);
      sortable.sort(function(a, b) { return a[1] - b[1]; });
      return sortable;
    };
    /**
     *
     */
	  function sentencesIntersection(sent1, sent2) {
		  var s1 = sent1.split(' ');
		  var s2 = sent2.split(' ');
		  var intersection = intersectSafe(s1, s2);
		  var avgLen = (s1.length + s2.length)/2;
		  return intersection.splice(0, avgLen).length;
	  };
    /**
     *
     */
	  function intersectSafe(a, b) {
		  // Original code from http://stackoverflow.com/a/1885660/394013
		  var ai = 0, bi = 0;
		  var result = [];
		  while (ai < a.length && bi < b.length) {
			  if      (a[ai] < b[bi] ) { ai++; }
			  else if (a[ai] > b[bi] ) { bi++; }
			  else {
				  result.push(a[ai]);
				  ai++;
				  bi++;
			  }
		  }
		  return result;
	  }
    /**
     *
     */
    function rankSentences(sentences) {
      var matrix = buildMatrix(sentences);
		  var num = sentences.length;
		  var cols = range(num);
		  var rows = range(num);
		  // Build sentence score dictionary.
		  var score, dict = {};
      cols.forEach(function(i) {
        score = 0;
        rows.forEach(function(j) {
				  if (i !== j) score += matrix[i][j];
			  });
			  var sentence = sentences[i];
			  dict[sentence] = score;
		  });
		  // Do the rank.
		  var sorted = sortObject(dict).reverse();
      return sorted.map(function(tuple) {
        return tuple[0];
      });
    }
    /**
     * Create an array range.
     * @example range(3) produces [0,1,2].
     */
    function range(n) {
		  var arr = [];
		  for (var i = 0; i < n; i++) {
        arr.push(i);
		  }
		  return arr;
    }
    /**
     *
     */
    function buildMatrix(sentences) {
		  var num = sentences.length;
		  var cols = range(num);
		  var rows = range(num);
		  var matrix = [];
		  // Allocate matrix cells.
      cols.forEach(function(i) {
        cell = [];
        rows.forEach(function(j) {
          cell.push(0);
			  });
			  matrix.push(cell);
		  });
		  // Compute intersections.
      cols.forEach(function(i) {
        rows.forEach(function(j) {
          matrix[i][j] = sentencesIntersection(sentences[i], sentences[j]);
			  });
		  });
      return matrix;
    };

    function summarize(sentences, count) {
      return rankSentences(sentences).slice(0, count);
    };

    // Expose public API.
    return {
      summarize: summarize,
    }

  };

  // Finally expose module.
  window.NaiveRank = new NaiveRank();

})(this);
