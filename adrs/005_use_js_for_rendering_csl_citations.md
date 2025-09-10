# Use JavaScript for rendering CSL Citations

## Context

In REACT based Library Search we used the JavaScript library
[citeproc-js](https://github.com/Juris-M/citeproc-js). We wanted to explore
rendering CSL citations in ruby so that they would be available whether or not a
user had Javascript enabled in their browser. We looked at
[citeproc-ruby](https://github.com/inukshuk/citeproc-ruby), got it somewhat
working, and then found that the output is not the same as what `citeproc-js`
generates.

This discrepancy (probably mostly) comes from using more ambiguous versions of
[metadata](https://github.com/citation-style-language/schema/blob/master/schemas/input/csl-data.json),
such as a "literal" for dates instead of the more specific "date-parts". The two
libraries handle these ambiguous fields differently. `citeproc-js` treats a
"literal" date as a year. `citeproc-ruby` treats it has both a year and a month.

We suspect that ExLibris is using `citeproc-js` in Primo.

Both `citeproc-js` and `citeproc-ruby` are widely used and are similary
supported. As of September 10, 2025, `citeproc-js` was last updated March 15,
2025, and `citeproc-ruby` was last updated June 20, 2025.

## Decision

We will used `citeproc-js` to render CSL citations.

## Status

| Date       | Summary |
|------------|---------|
| 2025-09-10 | Approved  |

## Consequences

* The CSL citations in this version of Library Search should look identical to
    the citations in the REACT version of Search
* Users will need to have JavaScript enabled in their browser in order to render
    CSL citations
* This should have a marginal on-load performance benefit because the rendering
    is done on demand instead of up front.
