# Overall Diagram of Library Search Architecture


[Figma diagram](https://www.figma.com/design/itOuZdXz1c1ATAUE0bFGrR/Library-Search---About-Library-Search-Diagram?node-id=2274-23624&t=5fDdidinkktofBsz-1)
is what is/will be shown on the website.

Last updated: 2026-10-01

```mermaid
flowchart TD
    A(Main Application <br> Front End Sinatra app <br> lives in search.application )
    H@{ shape: cloud, label: ExLibris Alma API}
    F@{ shape: cloud, label: "<b>ExLibris Primo API</b><br>Articles"}
    B[<b>Search API</b> <br> FastAPI json api <br> lives in search.index]
    C[<b>Search Parser</b><br>Sinatra API that queries SOLR and Primo<br> lives in search.index]
    D@{ shape: cyl, label: "<b>Catalog SOLR</b><br>Catalog, Onlinejournals"}
    G[<b>Catalog Browse</b><br> lives in search.catalog-browse]
    E@{ shape: cyl, label: "<b>Website SOLR</b><br>Databases, GuidesAndMore"}

    

    A --> |for search queries, single record, specialists| B
    A --> |for callnumber carousel| G
    A --> |for user info| H
    B -->|for search queries|C
    B --> |for up-to-date loan info| H

    B-->|for single record|D
    B-->|for single record|E
  
    C --> D
    C --> E
    C --> F
    B-->|for single record|F
```
