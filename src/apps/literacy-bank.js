// Egenförfattade texter och frågor. Alla bedömda svar stöds av texten.
export const FACT_TEXTS = [
  {
    "id": "fact-1",
    "title": "Biblioteket",
    "kind": "fact",
    "short": "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka.",
    "text": "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka. Ett lånekort används när du lånar. Böckerna behöver lämnas tillbaka så att fler kan läsa dem. Om du letar efter en viss bok kan du fråga bibliotekarien.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad kan du låna?",
        "answer": "böcker",
        "wrong": [
          "skor",
          "mat"
        ],
        "evidence": "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför ska böcker lämnas tillbaka?",
        "answer": "så att fler kan läsa dem",
        "wrong": [
          "så att ingen kan läsa",
          "så att kortet blir större"
        ],
        "evidence": "Ett lånekort används när du lånar. Böckerna behöver lämnas tillbaka så att fler kan läsa dem. Om du letar efter en viss bok kan du fråga bibliotekarien.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka.",
        "wrong": [
          "Is är fruset vatten. När is smälter blir den vatten.",
          "En segelbåt har ett segel. Vinden hjälper båten att röra sig."
        ],
        "evidence": "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-2",
    "title": "Plantera ett frö",
    "kind": "fact",
    "short": "Lägg ett frö i jord. Ge det vatten.",
    "text": "Lägg ett frö i jord. Ge det vatten. Fyll först en kruka med jord. Lägg sedan fröet i jorden och vattna försiktigt. Ställ krukan ljust. Följ hur plantan förändras när den växer.",
    "photo": "course-sprouts",
    "questions": [
      {
        "prompt": "Var lägger du fröet?",
        "answer": "i jord",
        "wrong": [
          "i en tom kopp",
          "på en bok"
        ],
        "evidence": "Lägg ett frö i jord. Ge det vatten.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad gör du efter att fröet lagts i jorden?",
        "answer": "vattnar försiktigt",
        "wrong": [
          "kastar krukan",
          "packar en väska"
        ],
        "evidence": "Fyll först en kruka med jord. Lägg sedan fröet i jorden och vattna försiktigt. Ställ krukan ljust. Följ hur plantan förändras när den växer.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Lägg ett frö i jord. Ge det vatten.",
        "wrong": [
          "En linjal har markeringar. Börja mäta vid noll.",
          "Papper kan samlas in för återvinning."
        ],
        "evidence": "Lägg ett frö i jord. Ge det vatten.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-3",
    "title": "Cykelns delar",
    "kind": "fact",
    "short": "En cykel har hjul och pedaler. Du trampar på pedalerna.",
    "text": "En cykel har hjul och pedaler. Du trampar på pedalerna. När du trampar på pedalerna överförs rörelsen till bakhjulet med hjälp av kedjan. Med styret kan du ändra riktning. Bromsarna hjälper dig att sakta ner.",
    "photo": "obj-bicycle",
    "questions": [
      {
        "prompt": "Vad trampar du på?",
        "answer": "pedalerna",
        "wrong": [
          "styret",
          "sadeln"
        ],
        "evidence": "En cykel har hjul och pedaler. Du trampar på pedalerna.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad hjälper dig att sakta ner?",
        "answer": "bromsarna",
        "wrong": [
          "kedjan ensam",
          "sadeln"
        ],
        "evidence": "När du trampar på pedalerna överförs rörelsen till bakhjulet med hjälp av kedjan. Med styret kan du ändra riktning. Bromsarna hjälper dig att sakta ner.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En cykel har hjul och pedaler. Du trampar på pedalerna.",
        "wrong": [
          "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska.",
          "Ett recept visar vad du behöver och hur du gör."
        ],
        "evidence": "En cykel har hjul och pedaler. Du trampar på pedalerna.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-4",
    "title": "Tvätta händerna",
    "kind": "fact",
    "short": "Tvätta händerna med tvål och vatten. Torka dem sedan.",
    "text": "Tvätta händerna med tvål och vatten. Torka dem sedan. Blöt först händerna. Tvåla in och gnugga också mellan fingrarna. Skölj bort tvålen och torka händerna. Tvål och vatten hjälper till att ta bort smuts.",
    "photo": "obj-water-drop",
    "questions": [
      {
        "prompt": "Vad använder du när du tvättar händerna?",
        "answer": "tvål och vatten",
        "wrong": [
          "jord och sand",
          "papper och lim"
        ],
        "evidence": "Tvätta händerna med tvål och vatten. Torka dem sedan.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad gör du efter att tvålen sköljts bort?",
        "answer": "torkar händerna",
        "wrong": [
          "tar på jord",
          "lägger händerna i en bok"
        ],
        "evidence": "Blöt först händerna. Tvåla in och gnugga också mellan fingrarna. Skölj bort tvålen och torka händerna. Tvål och vatten hjälper till att ta bort smuts.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Tvätta händerna med tvål och vatten. Torka dem sedan.",
        "wrong": [
          "När något stoppar ljuset kan en skugga bildas.",
          "En klocka visar tid. Visarna finns på urtavlan."
        ],
        "evidence": "Tvätta händerna med tvål och vatten. Torka dem sedan.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-5",
    "title": "På kartan",
    "kind": "fact",
    "short": "En karta visar platser. En symbol kan visa ett hus.",
    "text": "En karta visar platser. En symbol kan visa ett hus. En karta är en förenklad bild av ett område. Symboler kan visa hus och vägar. I teckenförklaringen står vad symbolerna betyder. Den hjälper dig att förstå kartan.",
    "photo": "obj-house",
    "questions": [
      {
        "prompt": "Vad kan en symbol visa?",
        "answer": "ett hus",
        "wrong": [
          "ett ljud",
          "en smak"
        ],
        "evidence": "En karta visar platser. En symbol kan visa ett hus.",
        "kind": "hitta"
      },
      {
        "prompt": "Var kan du hitta symbolernas betydelse?",
        "answer": "i teckenförklaringen",
        "wrong": [
          "i en sko",
          "på en matsedel"
        ],
        "evidence": "En karta är en förenklad bild av ett område. Symboler kan visa hus och vägar. I teckenförklaringen står vad symbolerna betyder. Den hjälper dig att förstå kartan.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En karta visar platser. En symbol kan visa ett hus.",
        "wrong": [
          "I ett äpple finns ett kärnhus. Där finns frön.",
          "Ett paraply kan skydda mot regn."
        ],
        "evidence": "En karta visar platser. En symbol kan visa ett hus.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-6",
    "title": "Is och vatten",
    "kind": "fact",
    "short": "Is är fruset vatten. När is smälter blir den vatten.",
    "text": "Is är fruset vatten. När is smälter blir den vatten. Vatten kan vara flytande eller fast. Is är vatten i fast form. När isen värms och smälter blir den flytande vatten. Förändringen kan följas genom att titta på samma isbit flera gånger.",
    "photo": "obj-ice",
    "questions": [
      {
        "prompt": "Vad blir is när den smälter?",
        "answer": "vatten",
        "wrong": [
          "sand",
          "trä"
        ],
        "evidence": "Is är fruset vatten. När is smälter blir den vatten.",
        "kind": "hitta"
      },
      {
        "prompt": "Hur kan du följa förändringen?",
        "answer": "titta på samma isbit flera gånger",
        "wrong": [
          "bara lyssna på en bok",
          "byta isbit varje gång"
        ],
        "evidence": "Vatten kan vara flytande eller fast. Is är vatten i fast form. När isen värms och smälter blir den flytande vatten. Förändringen kan följas genom att titta på samma isbit flera gånger.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Is är fruset vatten. När is smälter blir den vatten.",
        "wrong": [
          "En våg används för att väga saker.",
          "En nyckel kan användas till ett lås."
        ],
        "evidence": "Is är fruset vatten. När is smälter blir den vatten.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-7",
    "title": "En linjal",
    "kind": "fact",
    "short": "En linjal har markeringar. Börja mäta vid noll.",
    "text": "En linjal har markeringar. Börja mäta vid noll. Lägg föremålets ena ände vid nollmarkeringen. Läs av markeringen vid den andra änden. Linjalens kant är inte alltid samma plats som noll. Därför behöver du leta efter nollan.",
    "photo": "obj-ruler",
    "questions": [
      {
        "prompt": "Var börjar du mäta?",
        "answer": "vid noll",
        "wrong": [
          "vid tio",
          "vid valfri kant"
        ],
        "evidence": "En linjal har markeringar. Börja mäta vid noll.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför letar du efter nollan?",
        "answer": "kanten är inte alltid noll",
        "wrong": [
          "linjalen saknar markeringar",
          "allt är lika långt"
        ],
        "evidence": "Lägg föremålets ena ände vid nollmarkeringen. Läs av markeringen vid den andra änden. Linjalens kant är inte alltid samma plats som noll. Därför behöver du leta efter nollan.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En linjal har markeringar. Börja mäta vid noll.",
        "wrong": [
          "En segelbåt har ett segel. Vinden hjälper båten att röra sig.",
          "En ficklampa ger ljus. Du kan rikta den mot något."
        ],
        "evidence": "En linjal har markeringar. Börja mäta vid noll.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-8",
    "title": "Ett brev",
    "kind": "fact",
    "short": "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska.",
    "text": "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska. På kuvertet skriver avsändaren mottagarens adress. Mottagaren är den som ska få brevet. Avsändaren är den som skickar det. En adress hjälper posten att hitta rätt plats.",
    "photo": "obj-envelope",
    "questions": [
      {
        "prompt": "Var kan ett brev läggas?",
        "answer": "i ett kuvert",
        "wrong": [
          "i en sko",
          "i ett glas vatten"
        ],
        "evidence": "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad betyder mottagare?",
        "answer": "den som ska få brevet",
        "wrong": [
          "den som tillverkar papper",
          "den som alltid skriver brevet"
        ],
        "evidence": "På kuvertet skriver avsändaren mottagarens adress. Mottagaren är den som ska få brevet. Avsändaren är den som skickar det. En adress hjälper posten att hitta rätt plats.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska.",
        "wrong": [
          "Papper kan samlas in för återvinning.",
          "En skylt kan visa var en hylla finns."
        ],
        "evidence": "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-9",
    "title": "Skuggan",
    "kind": "fact",
    "short": "När något stoppar ljuset kan en skugga bildas.",
    "text": "När något stoppar ljuset kan en skugga bildas. En skugga bildas där ett föremål blockerar ljus. Om lampan eller föremålet flyttas kan skuggans form och läge ändras. För att undersöka detta kan du flytta en sak i taget.",
    "photo": "course-shadow",
    "questions": [
      {
        "prompt": "Vad kan bildas när ljuset stoppas?",
        "answer": "en skugga",
        "wrong": [
          "ett frö",
          "en bok"
        ],
        "evidence": "När något stoppar ljuset kan en skugga bildas.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför flytta en sak i taget?",
        "answer": "för att se vad som ändrar skuggan",
        "wrong": [
          "för att allt ska försvinna",
          "för att lampan ska bli en bok"
        ],
        "evidence": "En skugga bildas där ett föremål blockerar ljus. Om lampan eller föremålet flyttas kan skuggans form och läge ändras. För att undersöka detta kan du flytta en sak i taget.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "När något stoppar ljuset kan en skugga bildas.",
        "wrong": [
          "Ett recept visar vad du behöver och hur du gör.",
          "Du kan jämföra två saker. Skriv vad du ser."
        ],
        "evidence": "När något stoppar ljuset kan en skugga bildas.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-10",
    "title": "Äpplets frön",
    "kind": "fact",
    "short": "I ett äpple finns ett kärnhus. Där finns frön.",
    "text": "I ett äpple finns ett kärnhus. Där finns frön. Äpplets frön sitter i kärnhuset. Fruktköttet finns runt kärnhuset. Ett frö kan utvecklas till en ny planta när förhållandena passar. Alla frön blir inte nya träd.",
    "photo": "obj-apple",
    "questions": [
      {
        "prompt": "Var finns äpplets frön?",
        "answer": "i kärnhuset",
        "wrong": [
          "i skalets färg",
          "på en penna"
        ],
        "evidence": "I ett äpple finns ett kärnhus. Där finns frön.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad säger texten om fröna?",
        "answer": "alla blir inte nya träd",
        "wrong": [
          "alla blir genast träd",
          "inga kan bli plantor"
        ],
        "evidence": "Äpplets frön sitter i kärnhuset. Fruktköttet finns runt kärnhuset. Ett frö kan utvecklas till en ny planta när förhållandena passar. Alla frön blir inte nya träd.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "I ett äpple finns ett kärnhus. Där finns frön.",
        "wrong": [
          "En klocka visar tid. Visarna finns på urtavlan.",
          "Böcker har sidor. Vänd sidorna försiktigt."
        ],
        "evidence": "I ett äpple finns ett kärnhus. Där finns frön.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-11",
    "title": "En våg",
    "kind": "fact",
    "short": "En våg används för att väga saker.",
    "text": "En våg används för att väga saker. En våg kan visa ett föremåls massa, till exempel i gram. Två saker som är lika stora behöver inte väga lika mycket. Därför räcker det inte att bara titta på storleken när du vill jämföra deras massa.",
    "photo": "obj-scale",
    "questions": [
      {
        "prompt": "Vad använder du för att väga?",
        "answer": "en våg",
        "wrong": [
          "en bok",
          "ett kuvert"
        ],
        "evidence": "En våg används för att väga saker.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför räcker det inte att jämföra storleken?",
        "answer": "lika stora saker kan väga olika mycket",
        "wrong": [
          "allt väger lika mycket",
          "små saker saknar massa"
        ],
        "evidence": "En våg kan visa ett föremåls massa, till exempel i gram. Två saker som är lika stora behöver inte väga lika mycket. Därför räcker det inte att bara titta på storleken när du vill jämföra deras massa.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En våg används för att väga saker.",
        "wrong": [
          "Ett paraply kan skydda mot regn.",
          "Ett schema visar vad som ska hända och när."
        ],
        "evidence": "En våg används för att väga saker.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-12",
    "title": "Segelbåten",
    "kind": "fact",
    "short": "En segelbåt har ett segel. Vinden hjälper båten att röra sig.",
    "text": "En segelbåt har ett segel. Vinden hjälper båten att röra sig. Seglet fångar kraft från vinden. Med rodret kan den som seglar styra båten. Vindens riktning påverkar hur seglet behöver ställas. Båtens rörelse beror alltså på mer än bara dess färg.",
    "photo": "obj-sailboat",
    "questions": [
      {
        "prompt": "Vad hjälper segelbåten att röra sig?",
        "answer": "vinden",
        "wrong": [
          "båtens färg",
          "en bok"
        ],
        "evidence": "En segelbåt har ett segel. Vinden hjälper båten att röra sig.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad används för att styra båten?",
        "answer": "rodret",
        "wrong": [
          "en sko",
          "kuvertet"
        ],
        "evidence": "Seglet fångar kraft från vinden. Med rodret kan den som seglar styra båten. Vindens riktning påverkar hur seglet behöver ställas. Båtens rörelse beror alltså på mer än bara dess färg.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En segelbåt har ett segel. Vinden hjälper båten att röra sig.",
        "wrong": [
          "En nyckel kan användas till ett lås.",
          "En vägbeskrivning hjälper dig att hitta."
        ],
        "evidence": "En segelbåt har ett segel. Vinden hjälper båten att röra sig.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-13",
    "title": "Återvinna papper",
    "kind": "fact",
    "short": "Papper kan samlas in för återvinning.",
    "text": "Papper kan samlas in för återvinning. Vid återvinning används material igen. Insamlat papper kan bli råvara till nya pappersprodukter. Det är viktigt att följa sorteringsanvisningarna där du bor eftersom olika slags avfall ska sorteras på olika sätt.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad kan samlas in för återvinning?",
        "answer": "papper",
        "wrong": [
          "en tanke",
          "ett ljud"
        ],
        "evidence": "Papper kan samlas in för återvinning.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad betyder återvinning här?",
        "answer": "att material används igen",
        "wrong": [
          "att material alltid bränns hemma",
          "att allt blandas utan sortering"
        ],
        "evidence": "Vid återvinning används material igen. Insamlat papper kan bli råvara till nya pappersprodukter. Det är viktigt att följa sorteringsanvisningarna där du bor eftersom olika slags avfall ska sorteras på olika sätt.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Papper kan samlas in för återvinning.",
        "wrong": [
          "En ficklampa ger ljus. Du kan rikta den mot något.",
          "En faktatext berättar om något. En saga kan vara påhittad."
        ],
        "evidence": "Papper kan samlas in för återvinning.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-14",
    "title": "Receptet",
    "kind": "fact",
    "short": "Ett recept visar vad du behöver och hur du gör.",
    "text": "Ett recept visar vad du behöver och hur du gör. Ingredienser är det som används i maten. Ett recept har ofta en lista med ingredienser och instruktioner i ordning. Läs hela receptet först så att du vet vad du behöver innan du börjar.",
    "photo": "obj-bread",
    "questions": [
      {
        "prompt": "Vad visar ett recept?",
        "answer": "vad du behöver och hur du gör",
        "wrong": [
          "bara dagens väder",
          "bara ett namn"
        ],
        "evidence": "Ett recept visar vad du behöver och hur du gör.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför läsa hela receptet först?",
        "answer": "för att veta vad som behövs",
        "wrong": [
          "för att slippa alla ingredienser",
          "för att ändra tiden på klockan"
        ],
        "evidence": "Ingredienser är det som används i maten. Ett recept har ofta en lista med ingredienser och instruktioner i ordning. Läs hela receptet först så att du vet vad du behöver innan du börjar.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Ett recept visar vad du behöver och hur du gör.",
        "wrong": [
          "En skylt kan visa var en hylla finns.",
          "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka."
        ],
        "evidence": "Ett recept visar vad du behöver och hur du gör.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-15",
    "title": "Klockan",
    "kind": "fact",
    "short": "En klocka visar tid. Visarna finns på urtavlan.",
    "text": "En klocka visar tid. Visarna finns på urtavlan. På en klocka med visare finns en timvisare och en minutvisare. Timvisaren visar timmar och minutvisaren minuter. En digital klocka visar tiden med siffror i stället för dessa visare.",
    "photo": "obj-alarm-clock",
    "questions": [
      {
        "prompt": "Vad visar en klocka?",
        "answer": "tid",
        "wrong": [
          "massa",
          "smak"
        ],
        "evidence": "En klocka visar tid. Visarna finns på urtavlan.",
        "kind": "hitta"
      },
      {
        "prompt": "Hur visar en digital klocka tiden?",
        "answer": "med siffror",
        "wrong": [
          "med frön",
          "bara med färger"
        ],
        "evidence": "På en klocka med visare finns en timvisare och en minutvisare. Timvisaren visar timmar och minutvisaren minuter. En digital klocka visar tiden med siffror i stället för dessa visare.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En klocka visar tid. Visarna finns på urtavlan.",
        "wrong": [
          "Du kan jämföra två saker. Skriv vad du ser.",
          "Lägg ett frö i jord. Ge det vatten."
        ],
        "evidence": "En klocka visar tid. Visarna finns på urtavlan.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-16",
    "title": "Ett paraply",
    "kind": "fact",
    "short": "Ett paraply kan skydda mot regn.",
    "text": "Ett paraply kan skydda mot regn. När ett paraply fälls upp blir tyget utspänt. Regndroppar hamnar på tyget i stället för direkt på den som håller paraplyet. Ett uppfällt paraply tar mer plats än ett hopfällt.",
    "photo": "obj-umbrella",
    "questions": [
      {
        "prompt": "Vad kan paraplyet skydda mot?",
        "answer": "regn",
        "wrong": [
          "alla ljud",
          "mörker"
        ],
        "evidence": "Ett paraply kan skydda mot regn.",
        "kind": "hitta"
      },
      {
        "prompt": "När tar paraplyet mer plats?",
        "answer": "när det är uppfällt",
        "wrong": [
          "när det är hopfällt",
          "bara när det är torrt"
        ],
        "evidence": "När ett paraply fälls upp blir tyget utspänt. Regndroppar hamnar på tyget i stället för direkt på den som håller paraplyet. Ett uppfällt paraply tar mer plats än ett hopfällt.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Ett paraply kan skydda mot regn.",
        "wrong": [
          "Böcker har sidor. Vänd sidorna försiktigt.",
          "En cykel har hjul och pedaler. Du trampar på pedalerna."
        ],
        "evidence": "Ett paraply kan skydda mot regn.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-17",
    "title": "En nyckel",
    "kind": "fact",
    "short": "En nyckel kan användas till ett lås.",
    "text": "En nyckel kan användas till ett lås. En vanlig nyckel har en form som passar ett visst lås. Därför går det inte att öppna alla lås med samma nyckel. Förvara nyckeln så att du hittar den när du behöver den.",
    "photo": "obj-key",
    "questions": [
      {
        "prompt": "Vad kan en nyckel användas till?",
        "answer": "ett lås",
        "wrong": [
          "ett recept",
          "ett frö"
        ],
        "evidence": "En nyckel kan användas till ett lås.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför passar inte samma nyckel i alla lås?",
        "answer": "formen behöver passa låset",
        "wrong": [
          "alla nycklar är mjuka",
          "lås saknar delar"
        ],
        "evidence": "En vanlig nyckel har en form som passar ett visst lås. Därför går det inte att öppna alla lås med samma nyckel. Förvara nyckeln så att du hittar den när du behöver den.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En nyckel kan användas till ett lås.",
        "wrong": [
          "Ett schema visar vad som ska hända och när.",
          "Tvätta händerna med tvål och vatten. Torka dem sedan."
        ],
        "evidence": "En nyckel kan användas till ett lås.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-18",
    "title": "En ficklampa",
    "kind": "fact",
    "short": "En ficklampa ger ljus. Du kan rikta den mot något.",
    "text": "En ficklampa ger ljus. Du kan rikta den mot något. En ficklampa är en ljuskälla som kan bäras. När du ändrar lampans riktning hamnar ljuset på en annan plats. Det går att undersöka genom att lysa på samma vägg och vrida lampan försiktigt.",
    "photo": "obj-flashlight",
    "questions": [
      {
        "prompt": "Vad ger en ficklampa?",
        "answer": "ljus",
        "wrong": [
          "jord",
          "mat"
        ],
        "evidence": "En ficklampa ger ljus. Du kan rikta den mot något.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad ändras när du vrider lampan?",
        "answer": "platsen där ljuset hamnar",
        "wrong": [
          "väggens material",
          "lampans namn"
        ],
        "evidence": "En ficklampa är en ljuskälla som kan bäras. När du ändrar lampans riktning hamnar ljuset på en annan plats. Det går att undersöka genom att lysa på samma vägg och vrida lampan försiktigt.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En ficklampa ger ljus. Du kan rikta den mot något.",
        "wrong": [
          "En vägbeskrivning hjälper dig att hitta.",
          "En karta visar platser. En symbol kan visa ett hus."
        ],
        "evidence": "En ficklampa ger ljus. Du kan rikta den mot något.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-19",
    "title": "På bibliotekets skylt",
    "kind": "fact",
    "short": "En skylt kan visa var en hylla finns.",
    "text": "En skylt kan visa var en hylla finns. På en skylt i vårt låtsasbibliotek står det: Djur – hylla 4. Sagor – hylla 2. Kartor – hylla 6. Skyltens uppgift är att hjälpa besökaren hitta rätt hylla.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad kan en skylt visa?",
        "answer": "var en hylla finns",
        "wrong": [
          "hur maten smakar",
          "hur tung en sko är"
        ],
        "evidence": "En skylt kan visa var en hylla finns.",
        "kind": "hitta"
      },
      {
        "prompt": "Var finns kartorna enligt skylten?",
        "answer": "på hylla 6",
        "wrong": [
          "på hylla 4",
          "på hylla 2"
        ],
        "evidence": "På en skylt i vårt låtsasbibliotek står det: Djur – hylla 4. Sagor – hylla 2. Kartor – hylla 6. Skyltens uppgift är att hjälpa besökaren hitta rätt hylla.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En skylt kan visa var en hylla finns.",
        "wrong": [
          "En faktatext berättar om något. En saga kan vara påhittad.",
          "Is är fruset vatten. När is smälter blir den vatten."
        ],
        "evidence": "En skylt kan visa var en hylla finns.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-20",
    "title": "En enkel undersökning",
    "kind": "fact",
    "short": "Du kan jämföra två saker. Skriv vad du ser.",
    "text": "Du kan jämföra två saker. Skriv vad du ser. I en undersökning läggs två isbitar på var sin tallrik. En tallrik står varmt och den andra kallt. Isbitarna är lika stora från början. Den som undersöker antecknar hur isen förändras, utan att skriva resultatet i förväg.",
    "photo": "obj-ice",
    "questions": [
      {
        "prompt": "Vad kan du göra med två saker?",
        "answer": "jämföra dem",
        "wrong": [
          "göra dem till ord",
          "glömma dem direkt"
        ],
        "evidence": "Du kan jämföra två saker. Skriv vad du ser.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför är isbitarna lika stora från början?",
        "answer": "för att göra jämförelsen rättvisare",
        "wrong": [
          "för att de måste ha namn",
          "för att tallrikarna ska försvinna"
        ],
        "evidence": "I en undersökning läggs två isbitar på var sin tallrik. En tallrik står varmt och den andra kallt. Isbitarna är lika stora från början. Den som undersöker antecknar hur isen förändras, utan att skriva resultatet i förväg.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Du kan jämföra två saker. Skriv vad du ser.",
        "wrong": [
          "På biblioteket kan du låna böcker. Böckerna ska lämnas tillbaka.",
          "En linjal har markeringar. Börja mäta vid noll."
        ],
        "evidence": "Du kan jämföra två saker. Skriv vad du ser.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-21",
    "title": "Sköta en bok",
    "kind": "fact",
    "short": "Böcker har sidor. Vänd sidorna försiktigt.",
    "text": "Böcker har sidor. Vänd sidorna försiktigt. Ett bokmärke visar var du slutade läsa. Du kan använda det i stället för att vika sidans hörn. När du lägger boken på en torr plats minskar risken att sidorna blir blöta.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad ska du vända försiktigt?",
        "answer": "sidorna",
        "wrong": [
          "hjulen",
          "pedalerna"
        ],
        "evidence": "Böcker har sidor. Vänd sidorna försiktigt.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad visar bokmärket?",
        "answer": "var du slutade läsa",
        "wrong": [
          "hur mycket boken väger",
          "vem som äger alla böcker"
        ],
        "evidence": "Ett bokmärke visar var du slutade läsa. Du kan använda det i stället för att vika sidans hörn. När du lägger boken på en torr plats minskar risken att sidorna blir blöta.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Böcker har sidor. Vänd sidorna försiktigt.",
        "wrong": [
          "Lägg ett frö i jord. Ge det vatten.",
          "Ett brev kan läggas i ett kuvert. Adressen visar vart det ska."
        ],
        "evidence": "Böcker har sidor. Vänd sidorna försiktigt.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-22",
    "title": "Ett schema",
    "kind": "fact",
    "short": "Ett schema visar vad som ska hända och när.",
    "text": "Ett schema visar vad som ska hända och när. I klassens låtsasschema står det: Läsning klockan 9. Rast klockan 10. Bild klockan 11. Schemat visar den planerade ordningen. Om något ändras behöver schemat uppdateras.",
    "photo": "obj-alarm-clock",
    "questions": [
      {
        "prompt": "Vad visar ett schema?",
        "answer": "vad som ska hända och när",
        "wrong": [
          "hur stor en sten är",
          "vilken färg regn har"
        ],
        "evidence": "Ett schema visar vad som ska hända och när.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad kommer efter rasten i schemat?",
        "answer": "bild",
        "wrong": [
          "läsning",
          "rasten igen"
        ],
        "evidence": "I klassens låtsasschema står det: Läsning klockan 9. Rast klockan 10. Bild klockan 11. Schemat visar den planerade ordningen. Om något ändras behöver schemat uppdateras.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "Ett schema visar vad som ska hända och när.",
        "wrong": [
          "En cykel har hjul och pedaler. Du trampar på pedalerna.",
          "När något stoppar ljuset kan en skugga bildas."
        ],
        "evidence": "Ett schema visar vad som ska hända och när.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-23",
    "title": "En vägbeskrivning",
    "kind": "fact",
    "short": "En vägbeskrivning hjälper dig att hitta.",
    "text": "En vägbeskrivning hjälper dig att hitta. En vägbeskrivning kan vara ordnad i steg. I en låtsaspark lyder den: Gå till bron. Gå över bron. Sväng sedan vänster mot kiosken. Om du hoppar över ett steg kan du hamna på en annan plats.",
    "photo": "obj-house",
    "questions": [
      {
        "prompt": "Vad hjälper en vägbeskrivning dig med?",
        "answer": "att hitta",
        "wrong": [
          "att väga mat",
          "att stava alla ord"
        ],
        "evidence": "En vägbeskrivning hjälper dig att hitta.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad gör du direkt efter att ha gått över bron?",
        "answer": "svänger vänster",
        "wrong": [
          "går tillbaka hem",
          "svänger höger"
        ],
        "evidence": "En vägbeskrivning kan vara ordnad i steg. I en låtsaspark lyder den: Gå till bron. Gå över bron. Sväng sedan vänster mot kiosken. Om du hoppar över ett steg kan du hamna på en annan plats.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En vägbeskrivning hjälper dig att hitta.",
        "wrong": [
          "Tvätta händerna med tvål och vatten. Torka dem sedan.",
          "I ett äpple finns ett kärnhus. Där finns frön."
        ],
        "evidence": "En vägbeskrivning hjälper dig att hitta.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  },
  {
    "id": "fact-24",
    "title": "Fakta och fantasi",
    "kind": "fact",
    "short": "En faktatext berättar om något. En saga kan vara påhittad.",
    "text": "En faktatext berättar om något. En saga kan vara påhittad. En faktatext ska ge information som går att kontrollera. En berättelse kan innehålla fantasi, som en talande cykel. När du skriver behöver läsaren kunna förstå om du förklarar fakta eller hittar på en saga.",
    "photo": "obj-bicycle",
    "questions": [
      {
        "prompt": "Vilken text kan vara påhittad?",
        "answer": "en saga",
        "wrong": [
          "enbart ett kvitto",
          "alla faktatexter"
        ],
        "evidence": "En faktatext berättar om något. En saga kan vara påhittad.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad är ett exempel på fantasi i texten?",
        "answer": "en talande cykel",
        "wrong": [
          "en cykel med hjul",
          "en bok med sidor"
        ],
        "evidence": "En faktatext ska ge information som går att kontrollera. En berättelse kan innehålla fantasi, som en talande cykel. När du skriver behöver läsaren kunna förstå om du förklarar fakta eller hittar på en saga.",
        "kind": "förstå"
      },
      {
        "prompt": "Vilken sammanfattning passar bäst till texten?",
        "answer": "En faktatext berättar om något. En saga kan vara påhittad.",
        "wrong": [
          "En karta visar platser. En symbol kan visa ett hus.",
          "En våg används för att väga saker."
        ],
        "evidence": "En faktatext berättar om något. En saga kan vara påhittad.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Skriv två saker du lärde dig. Gör sedan en egen kort faktatext med rubrik."
  }
];

export const STORY_TEXTS = [
  {
    "id": "story-1",
    "title": "Nyckeln i parken",
    "kind": "story",
    "short": "Mira hittade en nyckel vid bänken. Hon gav den till parkens vakt.",
    "text": "Mira hittade en nyckel vid bänken. Hon gav den till parkens vakt. En stund senare kom en man och letade vid bänken. Vakten visade nyckeln och mannen log. Mira berättade var hon hade hittat den.",
    "photo": "obj-key",
    "questions": [
      {
        "prompt": "Vad hittade Mira?",
        "answer": "en nyckel",
        "wrong": [
          "en bok",
          "en vante"
        ],
        "evidence": "Mira hittade en nyckel vid bänken. Hon gav den till parkens vakt.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför letade mannen troligen vid bänken?",
        "answer": "han saknade nyckeln",
        "wrong": [
          "han ville måla bänken",
          "han hade tappat en cykel"
        ],
        "evidence": "En stund senare kom en man och letade vid bänken.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Mira hittade en nyckel vid bänken.",
        "wrong": [
          "En stund senare kom en man och letade vid bänken.",
          "Mira berättade var hon hade hittat den."
        ],
        "evidence": "Mira hittade en nyckel vid bänken. Hon gav den till parkens vakt.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-2",
    "title": "Boken som väntade",
    "kind": "story",
    "short": "Amir lånade en bok om havet. Han lade ett bokmärke på sidan där han slutade.",
    "text": "Amir lånade en bok om havet. Han lade ett bokmärke på sidan där han slutade. Nästa dag öppnade han boken vid bokmärket. Där fanns en bild av en segelbåt. Amir läste vidare och ritade sedan en egen båt.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad handlade boken om?",
        "answer": "havet",
        "wrong": [
          "snö",
          "tåg"
        ],
        "evidence": "Amir lånade en bok om havet. Han lade ett bokmärke på sidan där han slutade.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför använde Amir ett bokmärke?",
        "answer": "för att hitta där han slutade",
        "wrong": [
          "för att laga båten",
          "för att väga boken"
        ],
        "evidence": "Nästa dag öppnade han boken vid bokmärket.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Amir lånade en bok om havet.",
        "wrong": [
          "Nästa dag öppnade han boken vid bokmärket.",
          "Amir läste vidare och ritade sedan en egen båt."
        ],
        "evidence": "Amir lånade en bok om havet. Han lade ett bokmärke på sidan där han slutade.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-3",
    "title": "Fröet i krukan",
    "kind": "story",
    "short": "Lo sådde ett frö i en kruka. Varje dag tittade hon på jorden.",
    "text": "Lo sådde ett frö i en kruka. Varje dag tittade hon på jorden. Först syntes ingenting. Efter några dagar stack en liten grön planta upp. Lo ritade av plantan och satte datum på bilden för att kunna jämföra senare.",
    "photo": "course-sprouts",
    "questions": [
      {
        "prompt": "Var sådde Lo fröet?",
        "answer": "i en kruka",
        "wrong": [
          "på en bänk",
          "i ett kuvert"
        ],
        "evidence": "Lo sådde ett frö i en kruka. Varje dag tittade hon på jorden.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför skrev Lo datum på bilden?",
        "answer": "för att kunna jämföra senare",
        "wrong": [
          "för att göra jorden grön",
          "för att glömma plantan"
        ],
        "evidence": "Lo ritade av plantan och satte datum på bilden för att kunna jämföra senare.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Lo sådde ett frö i en kruka.",
        "wrong": [
          "Först syntes ingenting.",
          "Lo ritade av plantan och satte datum på bilden för att kunna jämföra senare."
        ],
        "evidence": "Lo sådde ett frö i en kruka. Varje dag tittade hon på jorden.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-4",
    "title": "Regnet på vägen",
    "kind": "story",
    "short": "Sam såg mörka moln. Han tog med sitt paraply när han gick ut.",
    "text": "Sam såg mörka moln. Han tog med sitt paraply när han gick ut. Vid lekparken började det regna. Sam fällde upp paraplyet. Han tänkte på teckningen i väskan och lade väskan under paraplyet också.",
    "photo": "obj-umbrella",
    "questions": [
      {
        "prompt": "Vad tog Sam med sig?",
        "answer": "ett paraply",
        "wrong": [
          "en kruka",
          "en våg"
        ],
        "evidence": "Sam såg mörka moln. Han tog med sitt paraply när han gick ut.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför lade Sam väskan under paraplyet?",
        "answer": "för att skydda teckningen från regnet",
        "wrong": [
          "för att väga den",
          "för att väskan skulle bli blöt"
        ],
        "evidence": "Han tänkte på teckningen i väskan och lade väskan under paraplyet också.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Sam såg mörka moln.",
        "wrong": [
          "Vid lekparken började det regna.",
          "Han tänkte på teckningen i väskan och lade väskan under paraplyet också."
        ],
        "evidence": "Sam såg mörka moln. Han tog med sitt paraply när han gick ut.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-5",
    "title": "Den långa skuggan",
    "kind": "story",
    "short": "Nora ritade av ett träds skugga på morgonen. Hon använde krita på marken.",
    "text": "Nora ritade av ett träds skugga på morgonen. Hon använde krita på marken. Efter lunch kom hon tillbaka. Skuggan låg inte kvar precis på kritstrecket. Nora jämförde och frågade sin lärare hur ljusets riktning hade ändrats.",
    "photo": "course-shadow",
    "questions": [
      {
        "prompt": "Vad ritade Nora av?",
        "answer": "ett träds skugga",
        "wrong": [
          "en bok",
          "en cykel"
        ],
        "evidence": "Nora ritade av ett träds skugga på morgonen. Hon använde krita på marken.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad märkte Nora efter lunch?",
        "answer": "skuggan låg på en annan plats",
        "wrong": [
          "kritan blev en lampa",
          "trädet hade försvunnit"
        ],
        "evidence": "Skuggan låg inte kvar precis på kritstrecket.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Nora ritade av ett träds skugga på morgonen.",
        "wrong": [
          "Efter lunch kom hon tillbaka.",
          "Nora jämförde och frågade sin lärare hur ljusets riktning hade ändrats."
        ],
        "evidence": "Nora ritade av ett träds skugga på morgonen. Hon använde krita på marken.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-6",
    "title": "Brevet till kusinen",
    "kind": "story",
    "short": "Eli skrev ett brev till sin kusin. Han berättade om sin nya cykel.",
    "text": "Eli skrev ett brev till sin kusin. Han berättade om sin nya cykel. Han lade brevet i ett kuvert men hittade inte adressen. Eli frågade en vuxen om hjälp. När adressen var skriven kunde brevet skickas.",
    "photo": "obj-envelope",
    "questions": [
      {
        "prompt": "Vem skrev Eli till?",
        "answer": "sin kusin",
        "wrong": [
          "parkens vakt",
          "en bibliotekarie"
        ],
        "evidence": "Eli skrev ett brev till sin kusin. Han berättade om sin nya cykel.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför kunde brevet skickas till slut?",
        "answer": "adressen hade skrivits på kuvertet",
        "wrong": [
          "cykeln blev större",
          "brevet blev en karta"
        ],
        "evidence": "När adressen var skriven kunde brevet skickas.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Eli skrev ett brev till sin kusin.",
        "wrong": [
          "Han lade brevet i ett kuvert men hittade inte adressen.",
          "När adressen var skriven kunde brevet skickas."
        ],
        "evidence": "Eli skrev ett brev till sin kusin. Han berättade om sin nya cykel.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-7",
    "title": "Två äpplen",
    "kind": "story",
    "short": "Ava hade två äpplen. Hon ville dela dem med sin vän.",
    "text": "Ava hade två äpplen. Hon ville dela dem med sin vän. De skar varje äpple i två lika stora delar med hjälp av en vuxen. Sedan tog de två halvor var. Ingen fick mer än den andra.",
    "photo": "obj-apple",
    "questions": [
      {
        "prompt": "Hur många äpplen hade Ava?",
        "answer": "två",
        "wrong": [
          "tre",
          "fem"
        ],
        "evidence": "Ava hade två äpplen. Hon ville dela dem med sin vän.",
        "kind": "hitta"
      },
      {
        "prompt": "Hur vet vi att de delade lika?",
        "answer": "de tog två halvor var",
        "wrong": [
          "Ava tog allt",
          "vännen fick inga halvor"
        ],
        "evidence": "Sedan tog de två halvor var. Ingen fick mer än den andra.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Ava hade två äpplen.",
        "wrong": [
          "De skar varje äpple i två lika stora delar med hjälp av en vuxen.",
          "Ingen fick mer än den andra."
        ],
        "evidence": "Ava hade två äpplen. Hon ville dela dem med sin vän.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-8",
    "title": "Båtbilden",
    "kind": "story",
    "short": "Kim såg en bild av en segelbåt. Han skrev en saga om en båt som kunde tala.",
    "text": "Kim såg en bild av en segelbåt. Han skrev en saga om en båt som kunde tala. Hans vän frågade om båtar verkligen kunde tala. Kim svarade att det var fantasi i hans saga. Sedan skrev han en faktamening om att vinden kan driva en segelbåt.",
    "photo": "obj-sailboat",
    "questions": [
      {
        "prompt": "Vad kunde båten göra i Kims saga?",
        "answer": "tala",
        "wrong": [
          "baka bröd",
          "cykla"
        ],
        "evidence": "Kim såg en bild av en segelbåt. Han skrev en saga om en båt som kunde tala.",
        "kind": "hitta"
      },
      {
        "prompt": "Vilken del var fantasi?",
        "answer": "att båten kunde tala",
        "wrong": [
          "att bilden visade en båt",
          "att Kim skrev en saga"
        ],
        "evidence": "Kim svarade att det var fantasi i hans saga.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Kim såg en bild av en segelbåt.",
        "wrong": [
          "Hans vän frågade om båtar verkligen kunde tala.",
          "Sedan skrev han en faktamening om att vinden kan driva en segelbåt."
        ],
        "evidence": "Kim såg en bild av en segelbåt. Han skrev en saga om en båt som kunde tala.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-9",
    "title": "Katten vid dörren",
    "kind": "story",
    "short": "Isa såg en katt vid dörren. Hon såg att katten hade våt päls.",
    "text": "Isa såg en katt vid dörren. Hon såg att katten hade våt päls. Isa skrev först att katten var arg. Sedan ändrade hon texten till att katten hade våt päls. Hon visste inte säkert hur katten kände sig.",
    "photo": "obj-cat",
    "questions": [
      {
        "prompt": "Vad såg Isa på katten?",
        "answer": "våt päls",
        "wrong": [
          "en röd hatt",
          "en nyckel"
        ],
        "evidence": "Isa såg en katt vid dörren. Hon såg att katten hade våt päls.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför ändrade Isa sin text?",
        "answer": "hon visste inte säkert hur katten kände sig",
        "wrong": [
          "katten skrev ett brev",
          "dörren var för liten"
        ],
        "evidence": "Hon visste inte säkert hur katten kände sig.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Isa såg en katt vid dörren.",
        "wrong": [
          "Isa skrev först att katten var arg.",
          "Hon visste inte säkert hur katten kände sig."
        ],
        "evidence": "Isa såg en katt vid dörren. Hon såg att katten hade våt päls.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-10",
    "title": "Mätningen",
    "kind": "story",
    "short": "Omar mätte sin penna. Han lade den vid linjalens kant.",
    "text": "Omar mätte sin penna. Han lade den vid linjalens kant. Sedan såg han att nollmarkeringen satt en bit från kanten. Han flyttade pennan till noll och mätte igen. Nu kunde han läsa av längden från rätt startpunkt.",
    "photo": "obj-ruler",
    "questions": [
      {
        "prompt": "Vad mätte Omar?",
        "answer": "sin penna",
        "wrong": [
          "ett träd",
          "sin väska"
        ],
        "evidence": "Omar mätte sin penna. Han lade den vid linjalens kant.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför mätte Omar igen?",
        "answer": "pennan började inte vid noll",
        "wrong": [
          "linjalen var en bok",
          "pennan hade blivit en båt"
        ],
        "evidence": "Han flyttade pennan till noll och mätte igen.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Omar mätte sin penna.",
        "wrong": [
          "Sedan såg han att nollmarkeringen satt en bit från kanten.",
          "Nu kunde han läsa av längden från rätt startpunkt."
        ],
        "evidence": "Omar mätte sin penna. Han lade den vid linjalens kant.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-11",
    "title": "Boken på bänken",
    "kind": "story",
    "short": "Tara hittade en bok på en bänk. På första sidan stod ett namn.",
    "text": "Tara hittade en bok på en bänk. På första sidan stod ett namn. Hon ville lämna tillbaka boken men visste inte vem personen var. Tara gick till skolans expedition med boken. Där kunde en vuxen hjälpa till att leta efter ägaren.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Var hittade Tara boken?",
        "answer": "på en bänk",
        "wrong": [
          "i havet",
          "i en kruka"
        ],
        "evidence": "Tara hittade en bok på en bänk. På första sidan stod ett namn.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför gick Tara till expeditionen?",
        "answer": "för att få hjälp att hitta ägaren",
        "wrong": [
          "för att kasta boken",
          "för att mäta bänken"
        ],
        "evidence": "Där kunde en vuxen hjälpa till att leta efter ägaren.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Tara hittade en bok på en bänk.",
        "wrong": [
          "Hon ville lämna tillbaka boken men visste inte vem personen var.",
          "Där kunde en vuxen hjälpa till att leta efter ägaren."
        ],
        "evidence": "Tara hittade en bok på en bänk. På första sidan stod ett namn.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  },
  {
    "id": "story-12",
    "title": "Lampan i kojan",
    "kind": "story",
    "short": "Noel byggde en koja med filtar. Inne i kojan var det mörkt.",
    "text": "Noel byggde en koja med filtar. Inne i kojan var det mörkt. Han hämtade en ficklampa och riktade den mot en bok. Nu kunde han se bilderna. När han vred lampan hamnade ljuset på filten i stället.",
    "photo": "obj-flashlight",
    "questions": [
      {
        "prompt": "Vad byggde Noel kojan av?",
        "answer": "filtar",
        "wrong": [
          "is",
          "äpplen"
        ],
        "evidence": "Noel byggde en koja med filtar. Inne i kojan var det mörkt.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför hämtade Noel lampan?",
        "answer": "för att kunna se i mörkret",
        "wrong": [
          "för att väga filtarna",
          "för att skicka ett brev"
        ],
        "evidence": "Inne i kojan var det mörkt. Nu kunde han se bilderna.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken händelse kommer först?",
        "answer": "Noel byggde en koja med filtar.",
        "wrong": [
          "Han hämtade en ficklampa och riktade den mot en bok.",
          "När han vred lampan hamnade ljuset på filten i stället."
        ],
        "evidence": "Noel byggde en koja med filtar. Inne i kojan var det mörkt.",
        "kind": "ordning"
      }
    ],
    "write": "Återberätta början, det som hände och slutet med egna ord. Hitta sedan på ett annat slut."
  }
];

// Bilden är en utgångspunkt: barnet väljer själv handling och perspektiv.
export const PICTURE_PROMPTS = [
 ['obj-cat','Kattens äventyr','Hitta på en plats för katten. Vad händer där?'],
 ['obj-key','Den oväntade nyckeln','Vilken plats kan nyckeln öppna i din saga?'],
 ['obj-sailboat','En resa på vattnet','Vart seglar båten och vad händer på vägen?'],
 ['obj-house','Huset med en hemlighet','Vem bor där och vad upptäcker besökaren?'],
 ['obj-book','Boken som förändrade dagen','Vad hittar någon mellan sidorna?'],
 ['obj-envelope','Ett brev anländer','Vem skickar brevet och vad leder det till?'],
 ['obj-bicycle','Cykelresan','Var börjar resan och vem möter cyklisten?'],
 ['obj-umbrella','Paraplyäventyret','Vad händer när regnet börjar?'],
 ['obj-flashlight','Ljuset i mörkret','Vad blir synligt när någon tänder lampan?'],
 ['course-sprouts','Den lilla plantan','Vem tar hand om plantan och hur förändras den?'],
 ['course-shadow','Skuggans berättelse','Vilken saga kan börja med den här skuggan?'],
 ['obj-apple','Äpplets resa','Hur kommer äpplet från trädet till en person?'],
 ['obj-monkey','Ett ovanligt möte','Vem möter apan och vad hittar de på?'],
 ['obj-car','Den långa resan','Vad gör att resan tar en oväntad vändning?'],
 ['obj-pencil','Pennans idé','Vem använder pennan och vad skapar personen?'],
 ['obj-flower','Blomman i present','Vem får blomman och varför?'],
 ['obj-paintbrush','Målningen','Vad målar någon och vem ser bilden?'],
 ['obj-dice','Spelet','Vem spelar och hur löser de ett problem tillsammans?'],
 ['obj-alarm-clock','Tiden för överraskningen','Vad händer när klockan når ett särskilt klockslag?'],
 ['obj-bread','Brödet i ryggsäcken','Vem ska dela brödet och på vilken plats?'],
 ['course-winter','En vinterdag','Vad vill huvudpersonen göra och hur går det?'],
 ['course-autumn','Höstens upptäckt','Vad hittar någon bland löven?'],
 ['course-spring','När våren kommer','Vad förändras och vad gör huvudpersonen?'],
 ['obj-ice','Isens hemlighet','Vilken saga kan börja med en isbit?'],
].map(([key,title,prompt],i)=>({id:`picture-${i+1}`,key,title,prompt}));

export const readingQuestions = (item, short) => short && !item.minLevel ? item.questions.filter(q=>q.kind==='hitta') : item.questions;

FACT_TEXTS.push(...[
  {
    "id": "fact-advanced-1",
    "title": "Två texter om en flaska",
    "kind": "fact",
    "minLevel": 4,
    "short": "I en påhittad annons står det: Vår flaska är bäst för alla! Annonsen är skriven av företaget som säljer flaskan.",
    "text": "I en påhittad annons står det: Vår flaska är bäst för alla! Annonsen är skriven av företaget som säljer flaskan. I ett test från en skolklass fylldes samma flaska med vatten. Eleverna vände den upp och ner tre gånger och skrev att den inte läckte i deras försök. Testet beskriver metoden, men jämför inte flaskan med andra modeller. Därför visar det inte att flaskan är bäst. Båda texterna handlar om samma produkt, men de har olika syften och ger olika slags underlag.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad vill annonsen främst göra?",
        "answer": "sälja flaskan",
        "wrong": [
          "redovisa alla flasktester",
          "beskriva jordens vatten"
        ],
        "evidence": "Annonsen är skriven av företaget som säljer flaskan.",
        "kind": "syfte"
      },
      {
        "prompt": "Vilket påstående stöds av testet?",
        "answer": "flaskan läckte inte i klassens tre försök",
        "wrong": [
          "flaskan är bäst för alla",
          "flaskan kan aldrig läcka"
        ],
        "evidence": "Eleverna vände den upp och ner tre gånger och skrev att den inte läckte i deras försök.",
        "kind": "slutsats"
      },
      {
        "prompt": "Vad saknas för att jämföra med andra modeller?",
        "answer": "tester av andra modeller",
        "wrong": [
          "en större rubrik",
          "företagets favoritfärg"
        ],
        "evidence": "Testet beskriver metoden, men jämför inte flaskan med andra modeller.",
        "kind": "jämföra"
      },
      {
        "prompt": "Vad betyder underlag i sammanhanget?",
        "answer": "information som ett påstående bygger på",
        "wrong": [
          "en matta under flaskan",
          "bara textens färg"
        ],
        "evidence": "Båda texterna handlar om samma produkt, men de har olika syften och ger olika slags underlag.",
        "kind": "begrepp"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "fact-advanced-2",
    "title": "Resultat från skolans läsdag",
    "kind": "fact",
    "minLevel": 4,
    "short": "Under en påhittad läsdag svarade tio elever på hur de helst läste just den dagen.",
    "text": "Under en påhittad läsdag svarade tio elever på hur de helst läste just den dagen. Sex valde en tryckt bok, tre valde en text på skärm och en valde att lyssna. Frågan gällde deras val den dagen, inte hur bra de läste. Klassen skrev datum och antal svar i sin tabell. En elev ville sätta rubriken Alla barn föredrar tryckta böcker. Gruppen ändrade rubriken till Våra tio svar på läsdagen, eftersom de inte hade frågat alla barn. De ville göra tydligt vilka resultaten faktiskt beskrev.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Hur många valde en tryckt bok?",
        "answer": "sex",
        "wrong": [
          "tre",
          "tio"
        ],
        "evidence": "Sex valde en tryckt bok, tre valde en text på skärm och en valde att lyssna.",
        "kind": "hitta"
      },
      {
        "prompt": "Vilken fråga besvarade undersökningen?",
        "answer": "hur eleverna helst läste den dagen",
        "wrong": [
          "hur bra alla barn läser",
          "vilken bok som har flest sidor"
        ],
        "evidence": "Frågan gällde deras val den dagen, inte hur bra de läste.",
        "kind": "förstå"
      },
      {
        "prompt": "Varför ändrades rubriken?",
        "answer": "resultatet gällde bara tio svar",
        "wrong": [
          "tryckta böcker saknar text",
          "ingen fick välja att lyssna"
        ],
        "evidence": "Gruppen ändrade rubriken till Våra tio svar på läsdagen, eftersom de inte hade frågat alla barn.",
        "kind": "slutsats"
      },
      {
        "prompt": "Vad hjälper läsaren förstå när svaren samlades in?",
        "answer": "datumet",
        "wrong": [
          "textens färg",
          "bokens omslag"
        ],
        "evidence": "Klassen skrev datum och antal svar i sin tabell.",
        "kind": "metod"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "fact-advanced-3",
    "title": "Gör en tydlig instruktion",
    "kind": "fact",
    "minLevel": 4,
    "short": "En instruktion behöver hjälpa mottagaren göra något.",
    "text": "En instruktion behöver hjälpa mottagaren göra något. Börja med att tala om målet och vilket material som behövs. Skriv sedan stegen i den ordning de ska utföras. Om en instruktion säger vik papperet behöver den ibland förklara var vikningen ska vara. En bild kan ge extra stöd. Låt någon som inte varit med och skrivit instruktionen prova den. Om personen behöver fråga om ett steg är det en ledtråd till vad som kan förtydligas. Att bearbeta instruktionen betyder att ändra den för att den ska fungera bättre.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad ska stegens ordning följa?",
        "answer": "ordningen de ska utföras",
        "wrong": [
          "längden på orden",
          "författarens favoritnummer"
        ],
        "evidence": "Skriv sedan stegen i den ordning de ska utföras.",
        "kind": "ordning"
      },
      {
        "prompt": "Varför låta en ny person prova?",
        "answer": "för att upptäcka otydliga steg",
        "wrong": [
          "för att slippa material",
          "för att få en ny färg"
        ],
        "evidence": "Om personen behöver fråga om ett steg är det en ledtråd till vad som kan förtydligas.",
        "kind": "förstå"
      },
      {
        "prompt": "Vad betyder bearbeta här?",
        "answer": "ändra för att texten ska fungera bättre",
        "wrong": [
          "gömma alla instruktioner",
          "läsa bara rubriken"
        ],
        "evidence": "Att bearbeta instruktionen betyder att ändra den för att den ska fungera bättre.",
        "kind": "begrepp"
      },
      {
        "prompt": "Vad kan en bild bidra med?",
        "answer": "extra stöd för stegen",
        "wrong": [
          "en garanti att alla förstår",
          "ett annat mål utan förklaring"
        ],
        "evidence": "En bild kan ge extra stöd.",
        "kind": "hitta"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "fact-advanced-4",
    "title": "Karta och verklighet",
    "kind": "fact",
    "minLevel": 4,
    "short": "En karta visar utvalda delar av en plats.",
    "text": "En karta visar utvalda delar av en plats. Det går inte att ta med allt, så kartans syfte avgör vilka detaljer som visas. En karta över en park kan markera stigar och toaletter, medan en annan karta kan visa olika träd. Teckenförklaringen beskriver symbolerna. Skalan beskriver förhållandet mellan en sträcka på kartan och i verkligheten. Om en centimeter motsvarar tio meter betyder två centimeter tjugo meter. Kartor kan också bli gamla när platsen förändras. Därför kan datum vara viktigt när du ska använda en karta.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad kan påverka vilka detaljer som visas?",
        "answer": "kartans syfte",
        "wrong": [
          "kartläsarens längd",
          "alltid bara pappersfärgen"
        ],
        "evidence": "Det går inte att ta med allt, så kartans syfte avgör vilka detaljer som visas.",
        "kind": "förstå"
      },
      {
        "prompt": "Vad motsvarar två centimeter i exemplet?",
        "answer": "tjugo meter",
        "wrong": [
          "tio meter",
          "två meter"
        ],
        "evidence": "Om en centimeter motsvarar tio meter betyder två centimeter tjugo meter.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad behöver jämföras för att förstå symbolerna?",
        "answer": "symbolerna och teckenförklaringen",
        "wrong": [
          "bara rubrikens storlek",
          "träden och en matsedel"
        ],
        "evidence": "Teckenförklaringen beskriver symbolerna.",
        "kind": "begrepp"
      },
      {
        "prompt": "Varför kan datumet vara viktigt?",
        "answer": "platsen kan ha förändrats",
        "wrong": [
          "kartor slutar alltid fungera efter en dag",
          "skalan ändras när man läser"
        ],
        "evidence": "Kartor kan också bli gamla när platsen förändras.",
        "kind": "slutsats"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "fact-advanced-5",
    "title": "Ett foto är ett urval",
    "kind": "fact",
    "minLevel": 4,
    "short": "Ett fotografi visar ett ögonblick och ett visst utsnitt.",
    "text": "Ett fotografi visar ett ögonblick och ett visst utsnitt. I en påhittad bild syns en full papperskorg på skolgården. Bilden visar att korgen var full när fotot togs. Den visar inte hur korgen såg ut under hela veckan eller varför den blev full. Fotografen kan ha valt en närbild som lämnar resten av gården utanför. För att undersöka hur sophanteringen fungerar kan eleverna göra fler observationer vid bestämda tider och fråga hur tömningen är planerad. Bilden kan vara en början till en fråga, men den besvarar inte alla frågor själv.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad kan bilden säkert visa enligt texten?",
        "answer": "att korgen var full vid fototillfället",
        "wrong": [
          "att korgen alltid är full",
          "vem som lade dit varje sak"
        ],
        "evidence": "Bilden visar att korgen var full när fotot togs.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad saknas för att beskriva hela veckan?",
        "answer": "fler observationer över tid",
        "wrong": [
          "en starkare färg",
          "ett större namn"
        ],
        "evidence": "Den visar inte hur korgen såg ut under hela veckan eller varför den blev full.",
        "kind": "slutsats"
      },
      {
        "prompt": "Vad betyder utsnitt?",
        "answer": "den del av motivet som visas",
        "wrong": [
          "all tid före bilden",
          "bara fotografens namn"
        ],
        "evidence": "Fotografen kan ha valt en närbild som lämnar resten av gården utanför.",
        "kind": "begrepp"
      },
      {
        "prompt": "Vilken fortsättning föreslås?",
        "answer": "observera och fråga om tömningen",
        "wrong": [
          "gissa vem som är skyldig",
          "anta att bilden visar hela gården"
        ],
        "evidence": "För att undersöka hur sophanteringen fungerar kan eleverna göra fler observationer vid bestämda tider och fråga hur tömningen är planerad.",
        "kind": "metod"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "fact-advanced-6",
    "title": "Två förslag till en rast",
    "kind": "fact",
    "minLevel": 4,
    "short": "På ett påhittat klassråd föreslog en grupp en hinderbana.",
    "text": "På ett påhittat klassråd föreslog en grupp en hinderbana. Deras argument var att den gav möjlighet till rörelse. En annan grupp föreslog en lugn ritplats och argumenterade för att alla ibland behöver en stillsam aktivitet. Klassen kunde välja att prova båda platserna under en vecka. Efter försöket ville de fråga hur eleverna kunde delta och vad som behövde ändras. Ett argument förklarar varför någon föreslår något. En omröstning kan hjälpa en grupp välja, men beslutet behöver fortfarande ta hänsyn till att olika elever ska kunna delta.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vilket argument gavs för ritplatsen?",
        "answer": "att ibland kunna göra något stillsamt",
        "wrong": [
          "att ingen ska få röra sig",
          "att alla måste rita likadant"
        ],
        "evidence": "En annan grupp föreslog en lugn ritplats och argumenterade för att alla ibland behöver en stillsam aktivitet.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad är ett argument enligt texten?",
        "answer": "en förklaring till ett förslag",
        "wrong": [
          "bara ett nummer på en lista",
          "en regel utan anledning"
        ],
        "evidence": "Ett argument förklarar varför någon föreslår något.",
        "kind": "begrepp"
      },
      {
        "prompt": "Vad ville klassen göra efter försöket?",
        "answer": "fråga om deltagande och förbättringar",
        "wrong": [
          "förbjuda alla frågor",
          "välja utan att pröva"
        ],
        "evidence": "Efter försöket ville de fråga hur eleverna kunde delta och vad som behövde ändras.",
        "kind": "ordning"
      },
      {
        "prompt": "Vilken sammanfattning passar?",
        "answer": "pröva idéer och granska hur de fungerar för olika elever",
        "wrong": [
          "majoriteten får alltid utesluta andra",
          "bara ett sätt att delta kan vara rätt"
        ],
        "evidence": "En omröstning kan hjälpa en grupp välja, men beslutet behöver fortfarande ta hänsyn till att olika elever ska kunna delta.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  }
]);

STORY_TEXTS.push(...[
  {
    "id": "story-advanced-7",
    "title": "Två bilder från samma plats",
    "kind": "story",
    "minLevel": 4,
    "short": "Rina tog en närbild av en blomma i parken.",
    "text": "Rina tog en närbild av en blomma i parken. Joel tog en bild där både blomman och en stor grävmaskin syntes. När de visade bilderna sa en kompis att Rinas park såg helt orörd ut. Rina tittade på Joels bild och märkte vad hennes utsnitt hade lämnat utanför. Hon lade bilderna bredvid varandra i sitt arbete. Under dem skrev hon att båda var tagna på samma plats och samma dag. Nu kunde läsaren se både blommans detaljer och arbetet runt den. Rina behöll sin närbild men ändrade bildtexten.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad visar Joels bild som Rinas inte visar?",
        "answer": "en grävmaskin",
        "wrong": [
          "en annan blomma på månen",
          "en bokhylla"
        ],
        "evidence": "Joel tog en bild där både blomman och en stor grävmaskin syntes.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför kunde kompisen få en annan uppfattning av Rinas bild?",
        "answer": "arbetet runt blomman låg utanför utsnittet",
        "wrong": [
          "parken hade flyttat",
          "bilderna var tagna olika år"
        ],
        "evidence": "Rina tittade på Joels bild och märkte vad hennes utsnitt hade lämnat utanför.",
        "kind": "tolka"
      },
      {
        "prompt": "Vilken förändring gjorde Rina till slut?",
        "answer": "hon ändrade bildtexten",
        "wrong": [
          "hon kastade alla bilder",
          "hon flyttade grävmaskinen"
        ],
        "evidence": "Rina behöll sin närbild men ändrade bildtexten.",
        "kind": "ordning"
      },
      {
        "prompt": "Vilken lärdom har stöd i berättelsen?",
        "answer": "två bilder kan visa olika delar av samma plats",
        "wrong": [
          "en närbild visar alltid allt",
          "alla bilder måste ha samma utsnitt"
        ],
        "evidence": "Nu kunde läsaren se både blommans detaljer och arbetet runt den.",
        "kind": "budskap"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "story-advanced-8",
    "title": "Instruktionen som provades",
    "kind": "story",
    "minLevel": 4,
    "short": "Teo skrev en instruktion för en pappersfigur.",
    "text": "Teo skrev en instruktion för en pappersfigur. Vik på mitten, skrev han, men ritade ingen bild. När Livia provade vek hon åt ett annat håll än Teo hade tänkt. Figuren fick en annan form. Teo ville först säga att Livia gjort fel, men läste sin instruktion igen. Den förklarade inte vilket håll vikningen skulle ha. Han lade till en bild och en tydligare mening. När Livia provade igen gick det att följa stegen. Teo skrev i sin anteckning att en läsare hade hjälpt honom förbättra texten.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad saknades i den första instruktionen?",
        "answer": "vilket håll vikningen skulle ha",
        "wrong": [
          "alla bokstäver",
          "namnet på skolan"
        ],
        "evidence": "Den förklarade inte vilket håll vikningen skulle ha.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför fick figuren först en annan form?",
        "answer": "Livia vek åt ett annat håll",
        "wrong": [
          "papperet kunde tala",
          "Teo hade ingen penna"
        ],
        "evidence": "När Livia provade vek hon åt ett annat håll än Teo hade tänkt.",
        "kind": "tolka"
      },
      {
        "prompt": "Vad gjorde Teo innan han ändrade texten?",
        "answer": "läste instruktionen igen",
        "wrong": [
          "kastade figuren direkt",
          "bytte till en karta"
        ],
        "evidence": "Teo ville först säga att Livia gjort fel, men läste sin instruktion igen.",
        "kind": "ordning"
      },
      {
        "prompt": "Vad visar slutet?",
        "answer": "att respons kan hjälpa till att förbättra en text",
        "wrong": [
          "att läsare aldrig ska fråga",
          "att instruktioner inte behöver prövas"
        ],
        "evidence": "Teo skrev i sin anteckning att en läsare hade hjälpt honom förbättra texten.",
        "kind": "budskap"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "story-advanced-9",
    "title": "Mätningen i gruppen",
    "kind": "story",
    "minLevel": 4,
    "short": "Nila och Aron ville jämföra hur långt en leksaksbil rullade på två mattor.",
    "text": "Nila och Aron ville jämföra hur långt en leksaksbil rullade på två mattor. Aron släppte bilen från en högre ramp på den ena mattan. Den rullade längre där. Nila började skriva att mattan var orsaken, men såg sedan att rampen också hade ändrats. Gruppen gjorde om försöken med samma starthöjd. De behöll de första resultaten i anteckningen och skrev varför de inte kunde jämföras på samma sätt. Efteråt hade de en tydligare metod och kunde beskriva vad de faktiskt undersökt.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vad ändrades förutom mattan?",
        "answer": "rampens höjd",
        "wrong": [
          "bilens namn",
          "antalet barn i berättelsen"
        ],
        "evidence": "Aron släppte bilen från en högre ramp på den ena mattan.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför gjorde de om försöken?",
        "answer": "två faktorer hade ändrats samtidigt",
        "wrong": [
          "de ville gömma bilen",
          "de glömde vad en matta var"
        ],
        "evidence": "Nila började skriva att mattan var orsaken, men såg sedan att rampen också hade ändrats.",
        "kind": "tolka"
      },
      {
        "prompt": "Vad gjorde de med de första resultaten?",
        "answer": "behöll och kommenterade dem",
        "wrong": [
          "raderade utan förklaring",
          "ändrade alla till samma tal"
        ],
        "evidence": "De behöll de första resultaten i anteckningen och skrev varför de inte kunde jämföras på samma sätt.",
        "kind": "hitta"
      },
      {
        "prompt": "Vilken lärdom passar?",
        "answer": "granska metoden innan du drar en slutsats",
        "wrong": [
          "välj alltid första resultatet",
          "resultat behöver aldrig dokumenteras"
        ],
        "evidence": "Efteråt hade de en tydligare metod och kunde beskriva vad de faktiskt undersökt.",
        "kind": "budskap"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "story-advanced-10",
    "title": "Det oväntade slutet",
    "kind": "story",
    "minLevel": 4,
    "short": "Meja skrev en saga om en nyckel som öppnade en dörr till havet.",
    "text": "Meja skrev en saga om en nyckel som öppnade en dörr till havet. Hennes vän undrade hur huvudpersonen hittade hem igen. Meja hade bara skrivit att allt blev bra. Hon läste början och såg att huvudpersonen hade ett rött snöre i fickan. I nästa version lät hon huvudpersonen knyta snöret vid dörren och följa det tillbaka. Slutet blev tydligare utan att hon behövde ta bort fantasin. Vännen kunde nu följa hur problemet löstes. Meja lade också till en mening om varför personen ville återvända.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vilken detalj från början använde Meja i slutet?",
        "answer": "ett rött snöre",
        "wrong": [
          "en cykel",
          "en blomkruka"
        ],
        "evidence": "Hon läste början och såg att huvudpersonen hade ett rött snöre i fickan.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför ändrade Meja slutet?",
        "answer": "läsaren behövde förstå hur personen hittade hem",
        "wrong": [
          "hon måste ta bort all fantasi",
          "nyckeln var en riktig provuppgift"
        ],
        "evidence": "Hennes vän undrade hur huvudpersonen hittade hem igen.",
        "kind": "tolka"
      },
      {
        "prompt": "Hur löstes problemet i nästa version?",
        "answer": "personen följde snöret tillbaka",
        "wrong": [
          "personen glömde dörren",
          "allt blev bra utan förklaring"
        ],
        "evidence": "I nästa version lät hon huvudpersonen knyta snöret vid dörren och följa det tillbaka.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad visar textbearbetningen?",
        "answer": "en tidigare detalj kan göra slutet mer sammanhängande",
        "wrong": [
          "ett slut får aldrig förklaras",
          "sagor får inte innehålla frågor"
        ],
        "evidence": "Vännen kunde nu följa hur problemet löstes.",
        "kind": "budskap"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "story-advanced-11",
    "title": "Rubriken på affischen",
    "kind": "story",
    "minLevel": 4,
    "short": "Ivo gjorde en affisch för en bokbytardag.",
    "text": "Ivo gjorde en affisch för en bokbytardag. Han ritade böcker och skrev en stor rubrik. När en kompis läste affischen frågade hon vilken dag och plats som gällde. Ivo såg att han hade glömt båda uppgifterna. Han lade till tiden och bibliotekets namn. Sedan bad han en annan person läsa affischen utan att förklara den muntligt. Personen kunde nu berätta när och var bokbytet skulle ske. Ivo behöll sin bild men flyttade texten så att den blev lättare att hitta. Han märkte att affischen behövde fungera även när han inte stod bredvid.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vilken information saknades först?",
        "answer": "dag och plats",
        "wrong": [
          "alla bilder",
          "rubriken"
        ],
        "evidence": "Ivo såg att han hade glömt båda uppgifterna.",
        "kind": "hitta"
      },
      {
        "prompt": "Varför lät Ivo en person läsa utan muntlig förklaring?",
        "answer": "för att pröva om affischen fungerade själv",
        "wrong": [
          "för att ingen skulle förstå",
          "för att slippa förbättra texten"
        ],
        "evidence": "Han märkte att affischen behövde fungera även när han inte stod bredvid.",
        "kind": "tolka"
      },
      {
        "prompt": "Vad flyttade Ivo i slutet?",
        "answer": "texten",
        "wrong": [
          "biblioteket",
          "bokbytardagen"
        ],
        "evidence": "Ivo behöll sin bild men flyttade texten så att den blev lättare att hitta.",
        "kind": "ordning"
      },
      {
        "prompt": "Vilket är berättelsens centrala problem?",
        "answer": "mottagaren saknade information för att delta",
        "wrong": [
          "böckerna hade inga sidor",
          "alla vägrade läsa affischer"
        ],
        "evidence": "När en kompis läste affischen frågade hon vilken dag och plats som gällde.",
        "kind": "sammanfatta"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  },
  {
    "id": "story-advanced-12",
    "title": "Olika sätt att vara med",
    "kind": "story",
    "minLevel": 4,
    "short": "Klassen planerade en gemensam rastlek.",
    "text": "Klassen planerade en gemensam rastlek. Några ville springa fort, medan andra ville röra sig lugnt eller rita. Först föreslogs en enda bana med många snabba moment. Lea frågade hur alla skulle kunna delta. Gruppen ritade om planen och lade till en lugn station där man kunde skapa en karta över leken. De provade planen och frågade efteråt vad som fungerade. En elev föreslog tydligare instruktioner mellan stationerna. Klassen skrev ner förslaget till nästa gång. De hade fortfarande olika önskemål men kunde bidra till samma aktivitet.",
    "photo": "obj-book",
    "questions": [
      {
        "prompt": "Vilken fråga ställde Lea?",
        "answer": "hur alla skulle kunna delta",
        "wrong": [
          "vem som var snabbast",
          "vilken bok som var dyrast"
        ],
        "evidence": "Lea frågade hur alla skulle kunna delta.",
        "kind": "hitta"
      },
      {
        "prompt": "Vad bidrog den lugna stationen med?",
        "answer": "ett annat sätt att vara med",
        "wrong": [
          "att alla måste springa",
          "att inga kartor fick skapas"
        ],
        "evidence": "Gruppen ritade om planen och lade till en lugn station där man kunde skapa en karta över leken.",
        "kind": "tolka"
      },
      {
        "prompt": "Vad föreslogs efter försöket?",
        "answer": "tydligare instruktioner mellan stationerna",
        "wrong": [
          "att gömma hela planen",
          "att förbjuda frågor"
        ],
        "evidence": "En elev föreslog tydligare instruktioner mellan stationerna.",
        "kind": "ordning"
      },
      {
        "prompt": "Vilken sammanfattning passar slutet?",
        "answer": "olika önskemål kunde rymmas i en gemensam aktivitet",
        "wrong": [
          "alla började tycka exakt samma",
          "bara snabba aktiviteter fungerade"
        ],
        "evidence": "De hade fortfarande olika önskemål men kunde bidra till samma aktivitet.",
        "kind": "budskap"
      }
    ],
    "write": "Sammanfatta med egna ord. Visa stöd i texten. Skriv sedan en egen text med samma ämne eller ett annat slut och bearbeta den för en mottagare."
  }
]);
