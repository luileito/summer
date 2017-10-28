(function() {

  function TextSplitter() {
    // Remember scope in callbacks.
    var self = this;
    /**
     * Retrieve a list of text sentences from a given text block.
     * This method ensures consistency in the resulting sentences,
     * including e.g. normalized whitespacing.
     * @param {String} Input string.
     * @return {Array}
     */
    this.getSentences = function(str) {
      var text = this.normalizeWhiteSpace(str);
      var sentences = this.splitText(text);
      if (!sentences) sentences = [text];
      return sentences.filter(self.isNotEmpty)
      .map(self.normalizeWhiteSpace)
      .map(self.capitalize)
      .map(self.punctualize);
    };
    /**
     * Split a block of text into a list of text sentences.
     * @param {String} str Input string.
     * In princle, HTML tags are not supported. But if you come up with a working approach to do so,
     * feel free to override this method.
     * @return {Array}
     */
    this.splitText = function(str) {
      if (!str) return '';
      // General approach: Split until punctuation symbols.
//      return str.match(/[^\.!\?]+[\.!\?]+/gm);
      // From https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
//      return str.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
//      return str.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");
      // From https://stackoverflow.com/questions/24441291/how-can-i-split-a-body-of-text-into-both-sentences-and-or-paragraph-breaks
//      return str.match(/[^\s.!?]+[^.!?\r\n]+[.!?]*/g);
      // From http://stackoverflow.com/questions/27630408/js-regex-to-split-text-into-sentences
      return str.match(/(.+?([A-Z].)[\.|\?](?:['")\\\s]?)+?\s?)/igm);
    };
    /**
     * Normalize spaces from a given string, as done in HTML parsing:
     * collapsing consecutive spaces, tabs, and new lines into a single space.
     * This method also removes leading and trailing spaces.
     * @param {String} str Input string.
     * @return {Boolean}
     */
    this.normalizeWhiteSpace = function(str) {
      return (str || '').replace(/[\s\t\n]+/g, ' ').trim();
    };
    /**
     * Determine if text is empty.
     * @param {String} Input string.
     * @return {Boolean}
     */
    this.isEmpty = function(str) {
      return (str || '') === '';
    };
    /**
     * Determine if text is empty.
     * @param {String} Input string.
     * @return {Boolean}
     */
    this.isNotEmpty = function(str) {
      return !self.isEmpty(str);
    };
    /**
     * Capitalize first letter of sentence.
     * If the first letter is already capitalized, this method does nothing.
     * @param {String} Input string.
     * @return {String}
     */
    this.capitalize = function(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    /**
     * Add an ending dot to sentence.
     * If the sentence already ends with some punctuation symbol, this method does nothing.
     * @param {String} Input string.
     * @return {String}
     */
    this.punctualize = function(str) {
      if (!str) return '';
      // In sentence does not end in a punctuation symbol or end_tag, add a dot.
      if (!str.match(/[!,;`'"\.\?>]$/)) str += '.';
      return str;
    };
  }

  window.TextSplitter = new TextSplitter();

})();
