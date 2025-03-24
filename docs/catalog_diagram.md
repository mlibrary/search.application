# Class Diagram for Catalog Records

```mermaid
classDiagram
   
  
    class Models_Record_Catalog {
      +String id
      bib()
      physical_holdings()
      electronic_holdings()
      hathi_trust_holdings()
    }
    class Models_Record_Catalog_Results {
      records()
      facets()    
    }
    class Models_Record_Catalog_Bib {
      title()
    }
    class Models_Record_Catalog_HathiTrust_Holding {
        name()
        items()
    }
    class Models_Record_Catalog_HathiTrust_Item {
        url()
    }
    class Models_Record_Catalog_Electronic_Holding {
        name()
        items()
    }
    class Models_Record_Catalog_Electronic_Item {
        url()
    }
       class Models_Record_Catalog_Physical_Holding {
        name()
        items()
    }
    class Models_Record_Catalog_Physical_Item {
        call_number()
        status()
    }

    class Presenter_Record_Catalog_Results {
        filters()
        records()
    }

    class Presenter_Record_Catalog_Full {
      title()
      record_info()
      holdings()
    }
     class Presenter_Record_Catalog_Medium {
      title()
      record_info()
      holdings()
    }
     class Presenter_Record_Catalog_Preview {
      title()
      record_info()
      holdings()
    }
    
   
    Presenter_Record_Catalog_Full o--Models_Record_Catalog
    Presenter_Record_Catalog_Medium o--Models_Record_Catalog
    Presenter_Record_Catalog_Preview o--Models_Record_Catalog
    Presenter_Record_Catalog_Results o--Models_Record_Catalog_Results
   Models_Record_Catalog_Results o-- "*" Presenter_Record_Catalog_Medium
    
    Models_Record_Catalog *-- "1" Models_Record_Catalog_Bib
    Models_Record_Catalog *-- "0..1" Models_Record_Catalog_HathiTrust_Holding
    Models_Record_Catalog *-- "0..1" Models_Record_Catalog_Electronic_Holding
    Models_Record_Catalog *-- "0..*" Models_Record_Catalog_Physical_Holding
    Models_Record_Catalog_HathiTrust_Holding *-- "1..*" Models_Record_Catalog_HathiTrust_Item
    Models_Record_Catalog_Electronic_Holding *-- "1..*" Models_Record_Catalog_Electronic_Item
    Models_Record_Catalog_Physical_Holding *-- "1..*" Models_Record_Catalog_Physical_Item

    note for Record_Catalog "Takes in result from the Catalog API"
```

## Notes

For the temporary list we will probably serialize `Record_Catalog` so it can be
generated from JSON. Or we could save the API output. That would do it, I think.
