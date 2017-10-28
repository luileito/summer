# Summer

Summer is a JavaScript software to enable Responsive Text Summarization,
an approach to web design aimed at allowing desktop web pages to be read
in response to the size of the device a user is browsing with.

![Sample output](teaser.png?raw=true)

The "Summer" name itself is a summarization of the word "Summ(ariz)er" :wink:

## How to use it

Just include `summer.min.js` from the [dist](dist) folder
and add the `--text-summary` CSS property to the element(s) you wish to summarize.
For instance, by setting `article .content { --text-summary: 0.8; }`,
the text of that element will be summarized to 80% of its original length.

## Available CSS properties

* `--text-summary: float|percentage|string` indicates the length of the sumarized text.
Default: none.

You can use a float in the [0.0, 1.0] range or a percentage in the [0%, 100%] range to set the summary length proportionally.
You can specify an exact number of sentences by using `N sentences`, where `N` is the desired number of sentences.
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
Default: none.

* `--text-summary-algorithm: string` indicates the summarization algorithm.
Two algorithms are currently available: `textrank` and `naiverank`.
Default: TextRank.

* `--text-summary-list: string` displays the sentences as a list, either `ordered` or `unordered` (itemized).
Default: none.

## Minimal working example

```html
<!doctype html>
<html>
  <head>
    <style>
      /* Set your desired CSS breakpoints and media queries. */
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
    <script src="dist/summer.min.js"></script>
  </head>
  <body>
    <article>
      <h1>About the World Wide Web</h1>
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

## Documentation

Run `npm run docs` to generate the JavaScript module documentation.

Alternatively, run `npm run docco` to generate a readable version of the source code.

## Tests

Run `npm test` and select either `performance tests` or `unit tests` from the top menu.

## Code linting

Run `npm run lint` to check for potential errors in the source code.

## Citation

Please cite as:
- L. A. Leiva. **Responsive Text Summarization**. *Inf. Process. Lett. ?(?), 2018.*

BibTeX entry:
```bibtex
@Article{Leiva18:RTS,
  author="Luis A. Leiva",
  title="Responsive Text Summarization",
  journal="Inf. Process. Lett.",
  volume="?",
  number="?",
  year="2018",
  doi = "?",
}
```