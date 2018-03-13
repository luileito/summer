(function(window) {

  var document = window.document;

  // Exit early if this browser cannot handle custom CSS properties.
  if (!window.CSS || !window.CSS.supports('(--foo: 1)')) {
    throw new Error('This browser does not support modern CSS standards.');
  }

  /**
   * Summer is a JavaScript software to enable Responsive Text Summarization,
   * an approach to web design aimed at allowing desktop web pages to be read
   * in response to the size of the device a user is browsing with.
   *
   * The "Summer" name itself is a summarization of the word "Summ(ariz)er" ;)
   * @author Luis A. Leiva, Sciling.
   * @see https://luis.leiva.name/web/docs/papers/rts-ipl18-preprint.pdf
   * @module Summer
   */
  function Summer() {
    // Remember lexical scope.
    var self = this;
    // Debounce timer.
    var throttle;

    /**
     * Set this property to `true` if you want to access the JavaScript API (also disables CSS parsing).
     * Otherwise, you must use the CSS API, as originally was intended.
     * Default: `false` (will use the CSS API).
     * @type {Object|String}
     * @memberof module:Summer
     */
    this.standalone = false;

    /**
     * Text summarization algorithm.
     * Default: `TextRank`.
     *
     * Currently, two algorithms are available:
     * - NaiveRank: a very naive algorithm based on sentence centroid (proof of concept).
     * - TextRank: Graph-based algorithm (recommended).
     *
     * Both algorithms have the same API: `algorithm.summarize(sentences, count)`,
     * thus if you want to add another algorithm, just follow the same API and add it to `Gruntfile.js`.
     *
     * This property can be set via CSS through the `--text-summary-algorithm`.
     * @type {Class}
     * @memberof module:Summer
     */
    this.algorithm = TextRank;

    // Silly checks.
    if (!this.algorithm) {
      throw new Error('No summarization algorithm supplied.');
    } else if (typeof this.algorithm.summarize !== 'function') {
      throw new Error('The selected summarization algorithm does not follow the required API.');
    }

    /**
     * Preserve sentence order after summarization.
     * Otherwise, the resulting summary will be the exact algorithm's output.
     * Default: `true`.
     * @type {String}
     * @memberof module:Summer
     */
    this.preserveOrder = true;

    /**
     * Sentence separator, for joining the resulting summarized sentences.
     * Default: `'\n'` (newline).
     * @type {String}
     * @memberof module:Summer
     */
    this.separator = '\n';

    /**
     * Display summary as an ordered or itemized list.
     * Valid CSS values are `ordered`, `unordered`, and `none`.
     *
     * This property can be set via CSS through the `--text-summary-list`.
     * Default: `null` (no list).
     * @type {String}
     * @memberof module:Summer
     */
    this.listStyle = null;

    /**
     * Filter out sentences having less words than those indicated here.
     *
     * This property can be set via CSS through the `--text-summary-skip-min-words`.
     * Default: `null` (no filtering).
     * @type {Number}
     * @memberof module:Summer
     */
    this.skipMinWords = null;

    /**
     * Filter out sentences having more words than those indicated here.
     *
     * This property can be set via CSS through the `--text-summary-skip-max-words`.
     * Default: `null` (no filtering).
     * @type {Number}
     * @memberof module:Summer
     */
    this.skipMaxWords = null;

    /**
     * DOMNode element or query selector where the summarized content will be put.
     * If not set, the source element text is replaced by the summarized content.
     *
     * This property can be set via CSS through the `--text-summary-target`.
     * Default: `false` (not set).
     * @type {Object|String}
     * @memberof module:Summer
     */
    this.targetElement = false;

    /**
     * Rank text sentences in an element according to the given value.
     * @param {Object} elem DOM Node element.
     * @param {Float|String} value Summary value; e.g. 0.5 or '50%'. Default: `none` (no summary).
     * @return {Array}
     * @memberof module:Summer
     * @example
     * Summer.standalone = true;
     * var sentences = Summer.rankSentences('article .content', '30%');
     */
    this.rankSentences = function(elem, value) {
      // Summarization algorithms typically require plain text as input,
      // so call `getSentences()` without the second arg.
      var sentences = self.getSentences(elem);
      // Filter out sentences having less than min words.
      if (self.skipMinWords > 0) {
        sentences = sentences.filter(function(sentence) {
          return sentence.split(' ').length > self.skipMinWords;
        });
      }
      // Filter out sentences having more that max words.
      if (self.skipMaxWords > 0) {
        sentences = sentences.filter(function(sentence) {
          return sentence.split(' ').length < self.skipMaxWords;
        });
      }
      // Ensure we get a valid number of sentences,
      // typically in the [0, N] range if we read in an integer
      // or in the [0.0, 1.0] range if we read in a float.
      value = normalizeValue(value);
      var count = value >= 1 ? value : Math.ceil(sentences.length * value);
      var ranked = self.algorithm.summarize(sentences, count);
      if (self.preserveOrder) ranked = preserveOrder(ranked, sentences);
      // When ranking sentences, retrieve the original HTML markup.
      var cached = getCache(elem);
      return ranked.map(searchInHTML.bind(self, cached.html));
    };

    /**
     * Retrieve text sentences in an element.
     * @param {Object} elem DOM Node element.
     * @param {Boolean} asHTML Retrieve the original HTML markup (true) or plain text (false, default).
     * @return {Array}
     * @memberof module:Summer
     * @example
     * Summer.standalone = true;
     * var sentences = Summer.getSentences('article .content');
     */
    this.getSentences = function(elem, asHTML) {
      // In standalone mode, the target element can be specified either as a selector or a DOM node.
      // Therefore, ensure that we get the actual DOM element here.
      if (typeof elem === 'string') {
        elem = document.querySelector(elem);
      }
      var cached = getCache(elem);
      var sentences = TextSplitter.getSentences(cached.text);
      // Output can be either as plain text (`asHTML = false`, default)
      // or the original HTML text (`asHTML = true`).
      return asHTML ? sentences.map(searchInHTML.bind(self, cached.html)) : sentences;
    };

    /**
     * Preserve original order of sentences in the text summary.
     * @param {Array} ranked Ranked sentences.
     * @param {Array} sentences Original sentences.
     * @return {Array}
     */
    function preserveOrder(ranked, sentences) {
      return sentences.filter(function(sentence) {
        return ranked.indexOf(sentence) > -1;
      });
    }

    /**
     * Replace element content by summarized content.
     * @param {Object|String} elem DOM element node or CSS selector.
     * @param {Number|String} value Summarization value, either an integer in the [0, N] range,
     * a float in the [0.0, 1.0] range, or a string like '2 sentences' or '50%'.
     * @return {Array} Summarized sentences (useful for unit testing).
     * @memberof module:Summer
     * @example
     * Summer.standalone = true;
     * Summer.summarize('article .content', '30%');
     */
    this.summarize = function(elem, value) {
      // In standalone mode, the target element can be specified either as a selector or a DOM node.
      // Therefore, ensure that we get the actual DOM element here.
      if (typeof elem === 'string') {
        elem = document.querySelector(elem);
      }
      // The given element's text will be replaced with the summarized content,
      // unless a `targetElement` is specified.
      var target = self.targetElement;
      // The target element can also be specified either as a selector or a DOM node.
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }
      // Ensure that target really exists on page, otherwise the source element will be used.
      if (!target) target = elem;
      // Display the top-N sentences.
      var summary = self.rankSentences(elem, value);
      var result = summary.join(self.separator);
      // Check if summary should be displayed as a list.
      if (self.listStyle && self.listStyle !== 'none') {
        // Wrap each sentence in a list item.
        var itemized = summary.map(function(sentence) {
          return '<li>' + sentence + '</li>';
        });
        // Wrap list in the given list style type.
        var tag = self.listStyle === 'ordered' ? 'ol' : 'ul';
        result = '<' + tag + ' class="text-summary">' + itemized.join(self.separator) + '</' + tag + '>';
      }
      // FIXME: Replacing the innerHTML will destroy associated DOM events.
      // By now, it's advised to use some form of event delegation:
      // https://gist.github.com/Daniel-Hug/abbded91dd55466e590b
      // See event delegation in action in `demo.html` file.
      target.innerHTML = result;
      // Return summarized sentences; useful for unit testing.
      return summary;
    };

    /**
     * Initialize the lib.
     * When not running in standalone mode (default), this method iterates over the loaded CSS
     * and process the elements having `--text-summary` CSS properties.
     * @param {Object} options Instance options (will override current public properties and methods).
     * @memberof module:Summer
     * @example
     * Summer.standalone = true;
     * Summer.init({
     *   standalone: true,
     *   separator: ' ',
     *   preserveOrder: false,
     * });
     */
    this.init = function(options) {
      // Override configuration if an actual config object is passed in.
      if (!(options instanceof Event)) {
        for (var o in options) {
          if (options.hasOwnProperty(o)) {
            self[o] = options[o];
          }
        }
      }
      // Disable CSS parsing in standalone mode.
      if (!self.standalone) {
        var docSstyles = document.styleSheets;
        for (var s = 0; s < docSstyles.length; s++) {
          var style = docSstyles[s];
          // Skip disabled stylesheets.
          if (style.disabled) continue;
          // Some browsers complain is stylesheets come from other domains,
          // and will throw an exception when accessing `style.cssRules`.
          try {
            if (style.cssRules) processRules(style.cssRules);
          } catch (err) {
            // This issue is well-known and documented elsewhere, e.g.
            // https://github.com/adobe/brackets/issues/10965
          }
        }
      }
    };

    // Keep track of the original source text.
    // Otherwise, we'll end up summarizing already summarized texts whenever a responsive breakpoint is reached;
    // e.g. multiple media queries can be applied to the same element, device orientation might change, etc.
    var elemCache = {
      // elementSelector : elementText
    };

    // Throttle summarization on a per element basis,
    // since CSS properties are applied in cascade
    // and we want to run summarization only once.
    var elemSummary = {
      // elementSelector : summaryValue
    };

    /**
     * Add element to cache and return the resulting structure.
     * @param {Object} elem DOM element node.
     * @return {Object}
     * @ignore
     */
    function addCache(elem) {
      var path = CSSPath(elem);
      if (typeof elemCache[path] === 'undefined') {
        // Make a copy of the contents to prevent memory leaks.
        elemCache[path] = {
          text: strCopy(elem.innerText),
          html: strCopy(elem.innerHTML),
        };
      }
      return elemCache[path];
    }

    /**
     * Retrieve element form cache.
     * @param {Object} elem DOM node.
     * @return {Object}
     */
    function getCache(elem) {
      var path = CSSPath(elem);
      return elemCache[path] || addCache(elem);
    }

    /**
     * Copy string, avoiding memory leaks.
     * @param {String} str Input string.
     * @return {String}
     */
    function strCopy(str) {
      return (str + '').substr(0).trim();
    }

    /**
     * Read CSS selector.
     * @param {Object} rule CSS rule.
     * @param {mixed} value CSS property value.
     * @return {String}
     * @ignore
     */
    function getSelectorFromRule(rule, value) {
      if (rule.cssText.match(value)) {
        return rule.selectorText;
      }
      return false;
    }

    /**
     * Process CSS properties related to text summarization.
     * @param {String} selector CSS selector.
     * @param {mixed} property CSS property value.
     * @ignore
     */
    function readSummaryRule(selector, property) {
      // Don't assume that the user wants to summarize just one element.
      var elements = document.querySelectorAll(selector);
      for (var e = 0; e < elements.length; e++) {
        var elem = elements[e];
        addCache(elem);
        // IE < 11 should use `elem.currentStyle`, but some methods used in this module
        // are not supported by IE < 11 either, such as `String.prototype.trim()`.
        // Therefore, old browsers are not going to be supported.
        var computedValue = window.getComputedStyle(elem).getPropertyValue(property).trim();
        switch (property) {
        case '--text-summary':
          // Don't perform summarization right now, since we can set other properties
          // that might affect how summarization should be performed.
          var path = CSSPath(elem);
          elemSummary[path] = computedValue;
          break;
        case '--text-summary-algorithm':
          self.algorithm = getClass(computedValue);
          break;
        case '--text-summary-target':
          self.targetElement = document.querySelector(computedValue);
          break;
        case '--text-summary-list':
          self.listStyle = computedValue;
          break;
        case '--text-summary-skip-max-words':
          self.skipMaxWords = parseInt(computedValue, 10);
          break;
        case '--text-summary-skip-min-words':
          self.skipMinWords = parseInt(computedValue, 10);
          break;
        default:
          break;
        }
      }
    }

    /**
     * Retrieve class from global namespace.
     * @param {String} str Input string.
     * @return {class}
     */
    function getClass(str) {
      var className = TextSplitter.capitalize(toCamelCase(str));
      return window[className];
    }

    /**
     * Convert string with dashes to camelCase.
     * @param {String} str Input string.
     * @return {String}
     */
    function toCamelCase(str) {
      return str.replace(/-(.)/g, function(x, chr) {
        return chr.toUpperCase();
      });
    }

    /**
     * Normalize a given summarization value.
     * @param {mixed} value CSS property value.
     * @return {Number}
     * @ignore
     */
    function normalizeValue(value) {
      // Disable summarization if we get somethig weird like 'none' or empty string.
      // Notice that '1' is a degenerate case: does it mean '1 sentence' or 'ratio 1.0'?
      // XXX: The 'inherit' value is automatically handled by the browser.
      if (value !== 0 && (!value || value === 'none')) return 0.99;
      // We read every CSS property as a string, however this function can be called
      // in standalone mode, which means that it can receive many different inputs,
      // such as 1, "1.0", .2, "50%', 4, "3 sentences", etc.
      if (typeof value === 'number') {
        return processInt(value);
      } else if (value.indexOf('sentence') > -1) {
        // The user wants a specific number of sentences.
        value = parseInt(value, 10);
        return processInt(value);
      } else {
        // The user wants a percentage of the sentences.
        if (value.substr(-1) === '%') {
          value = parseInt(value, 10) / 100;
        } else {
          value = parseFloat(value);
        }
        return processFloat(value);
      }
    }

    /**
     * Process integer value.
     * @param {Number} value Integer value.
     * @return {Number} Clamped value in [0, N] range.
     */
    function processInt(value) {
      // Ensure at least zero sentences.
      return clamp(value, 0);
    }
    /**
     * Process float value.
     * @param {Number} value Float value.
     * @return {Number} Clamped value in [0.0, 1.0] range.
     */
    function processFloat(value) {
      value = clamp(value, 0, 1);
      // Deal with degenerate case.
      if (value === 1) value -= 0.01;
      return value;
    }

    /**
     * Clamp value in given range.
     * @param {Number} value Input value.
     * @param {Number} lower Min allowed value.
     * @param {Number} upper Max allowed value.
     * @return {Number}
     */
    function clamp(value, lower, upper) {
      if (typeof lower !== 'undefined' && value < lower) value = lower;
      if (typeof upper !== 'undefined' && value > upper) value = upper;
      return value;
    }

    /**
     * Apply summarization according to given rule.
     * @param {Object} rule CSS rule.
     * @ignore
     */
    function processElementsFromRule(rule) {
      // We're using non-standard CSS properties, so instead of accessing e.g. `rule.style.textSummary`
      // we must use a custom lookup function here.
      var prefix = '--text-summary';
      var values = ['', '-algorithm', '-target', '-list', '-skip-min-words', '-skip-max-words'].map(function(val) {
        return prefix + val;
      });
      values.forEach(function(value) {
        var selector = getSelectorFromRule(rule, value);
        readSummaryRule(selector, value);
      });
    }

    /**
     * Parse document CSS rules.
     * @param {Array} rules CSS rules.
     * @ignore
     */
    function processRules(rules) {
      // Read CSS rules.
      for (var r = 0; r < rules.length; r++) {
        var rule = rules[r];
        if (rule instanceof CSSStyleRule) {
          processElementsFromRule(rule);
        } else if (rule instanceof CSSMediaRule) {
          var mq = window.matchMedia(rule.media.mediaText);
          // if (mq.matches) ... would not allow to reset state.
          processRules(rule.cssRules);
          // React to media query events, such as `deviceorientation`.
          mq.addListener(function(query) {
            // if (mq.matches) ... would not allow to reset state.
            processRules(rule.cssRules);
          });
        }
      }
      clearTimeout(throttle);
      throttle = setTimeout(applyRules, 10);
    }

    /**
     * Apply CSS rules related to text summarization.
     */
    function applyRules() {
      for (var path in elemSummary) {
        if (elemSummary.hasOwnProperty(path)) {
          var elem = document.querySelector(path);
          var value = elemSummary[path];
          self.summarize(elem, value);
        }
      }
    }

    /**
     * Search text in given element and return the HTML contents.
     * @param {Object} elem DOM node.
     * @param {String} str Input string.
     * @return {String}
     */
    function searchInElement(elem, str) {
      var ret;
      if (window.find && window.getSelection) {
        document.designMode = 'on';
        var sel = window.getSelection();
        sel.collapse(elem, 0);
        while (window.find(str)) {
          document.execCommand('HiliteColor', false, 'white');
          sel.collapseToEnd();
          ret = sel.anchorNode.parentNode.innerHTML;
        }
        document.designMode = 'off';
        sel.removeAllRanges();
      } else if (elem.createTextRange) {
        // Old IE browsers only. Not supported!
      }
      // Ensure that we retrieved the expected sentence.
      if (ret && stripTags(ret).length == str.length) {
        return ret;
      }
      // Otherwise return search string as fallback.
      return str;
    }

    /**
     * Search text in given element and return the HTML contents.
     * @param {Object} html HTML text.
     * @param {String} str Input string.
     * @return {String}
     */
    function searchInHTML(html, str) {
      fakeElement.innerHTML = html;
      return searchInElement(fakeElement, str);
    }

    // Temp DIV to remove HTML tags.
    var tmpDiv = document.createElement('div');
    /**
     * Remove HTML tags from string.
     * @param {Object} html HTML text.
     * @return {String}
     */
    function stripTags(html) {
       tmpDiv.innerHTML = html;
       return tmpDiv.textContent || tmpDiv.innerText || '';
    }

  }

  // Create a dummy element with a copy of the original text.
  // This is required to restore HTML markup back and forth.
  var fakeElement = document.createElement('div');
  // The element MUST belong to the DOM but we cannot hide it effectively,
  // since the current method to search in HTML relies on `display:auto` or `visibility:visible`.
  fakeElement.style.position = 'absolute';
  fakeElement.style.bottom = '0px';
  fakeElement.style.left = '-9999999px';

  // Run on startup. You can also call `Summer.init` at any time afterward.
  document.addEventListener('DOMContentLoaded', function(ev) {
    // Cannot add DOM nodes until now.
    document.body.appendChild(fakeElement);
    // This wrap will ensure some dynamic stuff is fully loaded.
    window.setTimeout(window.Summer.init, 0);
  });

  // Finally expose module.
  window.Summer = new Summer();

})(this);
