# Summer

Summer is a JavaScript software to enable **Responsive Text Summarization**,
an approach to web design aimed at allowing desktop web pages to be read
in response to the size of the device a user is browsing with.

![Sample output](teaser.png?raw=true)

Summer automatically removes non-relevant sentences from a source text according to your CSS media queries.
For instance, your desktop users could read the full text and your mobile users just half of the content
(those users would read the relevant half of the content, BTW).

The "Summer" name itself is a summarization of the word "Summ(ariz)er" :wink:

## How to use it

Just include `summer.min.js` from the [dist](dist) folder
and add the `--text-summary` CSS property to the element(s) you wish to summarize.
For instance, by setting `#someId { --text-summary: 0.8; }` in your stylesheet,
the text inside the `#someId` element will be summarized to 80% of its original length.

**Note:** HTML tags are preserved but DOM events are not (you should use [event delegation](https://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/) for that).

## Available CSS properties

You can configure the following properties in your CSS stylesheets.

* `--text-summary: float|percentage|string` indicates the length of the sumarized text.
Default: `none`.

You can use a float in the [0.0, 1.0] range or a percentage in the [0%, 100%] range to set the summary length proportionally.
You can also specify an exact number of sentences by using `N sentences`, where `N` is the desired number of sentences.

Examples:
```css
/* Set summary ratio to 80%. */
article .content { --text-summary: 0.8; }
/* Same, but using percentage notation. */
article .content { --text-summary: 80%; }
/* Set a specific number of sentences. */
article .content { --text-summary: 3 sentences; }
```

* `--text-summary-target: string` indicates the target element that will display the text summary.
Default: `none` (the source element will be summarized).

Example:
```css
/* Set summary ratio of "article .content" to 80%, */
/* but will display the summary in "#snippet" element. */
article .content {
  --text-summary: 0.8;
  --text-summary-target: #snippet;
}
```

* `--text-summary-algorithm: string` indicates the summarization algorithm.
Two algorithms are currently available: `textrank` (recommended) and `naiverank` (proof of concept).
Default: `textrank`.

Example:
```css
/* Change summarization algorithm to NaiveRank. */
article .content {
  --text-summary: 0.8;
  --text-summary-algorithm: naiverank;
}
```

* `--text-summary-list: string` displays the sentences as a list, either `ordered` or `unordered` (itemized).
Default: `none`.

Example:
```css
/* Will display the text summary as an itemized list. */
article .content {
  --text-summary: 0.8;
  --text-summary-list: unordered;
}
```

* `--text-summary-skip-min-words: number` filters out sentences having less words than the given number.
Default: `null`.

Example:
```css
/* Will skip sentences having less than 5 words. */
article .content {
  --text-summary: 0.8;
  --text-summary-skip-min-words: 5;
}
```

* `--text-summary-skip-max-words: number` filters out sentences having more words than the given number.
Default: `null`.

Example:
```css
/* Will skip sentences having more than 50 words. */
article .content {
  --text-summary: 0.8;
  --text-summary-skip-max-words: 50;
}
```

## Minimal working example

Save the HTML file below as `mwe.html` together with `summer.min.js`.
Then open it with your browser and resize the window:
the text will be summarized at different lengths,
upon reaching each of specified CSS break points below.

```html
<!doctype html>
<html>
  <head>
    <style>
      h1 { margin-bottom: 0; }
      h1 + p { margin-top: 0; }
      /* Some CSS media queries for responsive summarization. */
      @media all and (max-width: 1024px) {
        article .content { --text-summary: 0.8; }
      }
      @media (max-width: 640px) {
        article .content { --text-summary: 50%; }
      }
      @media (max-width: 480px) {
        article .content { --text-summary: 0.3; }
      }
    </style>
    <script src="summer.min.js"></script>
  </head>
  <body>
    <article>
      <h1>About the World Wide Web</h1>
      <p><small>From Wikipedia, the free encyclopedia</small></p>
      <div class="content">
        <p>The <b>World Wide Web</b> (abbreviated <b>WWW</b> or <b>the Web</b>) is an <a href="/wiki/Information_space" title="Information space">information space</a> where documents and other <a href="/wiki/Web_resource" title="Web resource">web resources</a> are identified by <a href="/wiki/Uniform_Resource_Locator" class="mw-redirect" title="Uniform Resource Locator">Uniform Resource Locators</a> (URLs), interlinked by <a href="/wiki/Hypertext" title="Hypertext">hypertext</a> links, and can be accessed via the <a href="/wiki/Internet" title="Internet">Internet</a>. English scientist <a href="/wiki/Tim_Berners-Lee" title="Tim Berners-Lee">Tim Berners-Lee</a> invented the World Wide Web in 1989. He wrote the first web browser <a href="/wiki/Computer_program" title="Computer program">computer program</a> in 1990 while employed at <a href="/wiki/CERN" title="CERN">CERN</a> in Switzerland. The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.</p>
        <p>The World Wide Web has been central to the development of the <a href="/wiki/Information_Age" title="Information Age">Information Age</a> and is the primary tool billions of people use to interact on the Internet. <a href="/wiki/Web_page" title="Web page">Web pages</a> are primarily <a href="/wiki/Plain_text" title="Plain text">text</a> documents <a href="/wiki/Formatted_text" title="Formatted text">formatted</a> and annotated with <a href="/wiki/HTML" title="HTML">Hypertext Markup Language</a> (HTML). In addition to formatted text, web pages may contain <a href="/wiki/Image" title="Image">images</a>, <a href="/wiki/Video" title="Video">video</a>, <a href="/wiki/Audio_signal" title="Audio signal">audio</a>, and software components that are rendered in the user's <a href="/wiki/Web_browser" title="Web browser">web browser</a> as coherent pages of <a href="/wiki/Multimedia" title="Multimedia">multimedia</a> content.</p>
        <p>Embedded <a href="/wiki/Hyperlink" title="Hyperlink">hyperlinks</a> permit users to <a href="/wiki/Web_navigation" title="Web navigation">navigate</a> between web pages. Multiple web pages with a common theme, a common <a href="/wiki/Domain_name" title="Domain name">domain name</a>, or both, make up a <a href="/wiki/Website" title="Website">website</a>. Website content can largely be provided by the publisher, or interactively where users contribute content or the content depends upon the users or their actions. Websites may be mostly informative, primarily for entertainment, or largely for commercial, governmental, or non-governmental organisational purposes.</p>
        <p>Viewing a web page on the World Wide Web normally begins either by typing the URL of the page into a web browser, or by following a hyperlink to that page or resource.</p>
      </div>
    </article>
  </body>
</html>
```

## JavaScript API

It is possible to use Summer in vanilla JavaScript, though you'll miss the beauty of responsive web design via CSS breakpoints et al.
Anyways, here's how you can do it:
```js
// Indicate that Summer will run in standalone mode, which will disable CSS parsing.
Summer.standalone = true;
// From here onward you just have to call the `summarize` method.
Summer.summarize('article .content', '2 sentences');
```

All configurable CSS properties are available in the JavaScript API.
Read the [JavaScript documentation](#documentation) to know more.

## Demo & Tests

Run `npm test` to launch a demo server.
Then, select either `performance tests` or `unit tests` from the top menu.
The test results are shown in the developer console (hit <kbd>F12</kbd> to open it).

**Note:** You need `http-server` to run the demo server. If that's not the case, run `[sudo] npm i -g http-server`.

## Documentation

Run `npm run docs` to generate the JavaScript documentation.

Alternatively, run `npm run docco` to generate a readable version of the source code.

**Note:** You need `jsdoc` and `docco` to run these commands. If that's not the case, run `[sudo] npm i -g jsdoc docco`.

## Minification

Run `npm run dist` to re-create the `summer.min.js` file in the [dist](dist) folder.

**Note:** You need to install the dev dependencies, just run `npm i`.

## Code linting

Run `npm run lint` to check for potential errors in the source code.

**Note:** You need `eslint` to run this command. If that's not the case, run `[sudo] npm i -g eslint`.

## Citation

Please cite as:
- Leiva, L. A. (2018) **Responsive Text Summarization**. *Inf. Process. Lett.* 130.

BibTeX entry:
```bibtex
@Article{Leiva18:RTS,
  author  = "Luis A. Leiva",
  title   = "Responsive Text Summarization",
  journal = "Inf. Process. Lett.",
  volume  = "130",
  year    = "2018",
  doi     = "https://doi.org/10.1016/j.ipl.2017.10.007",
}
```

## License

This libray is released with the [MIT license](LICENSE).
The only requirement is that you keep my copyright notice intact when you repurpose, redistribute, or reuse this code.
