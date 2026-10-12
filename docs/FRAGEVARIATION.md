# Frågevariation och utbyggda banker

Genomgång 2026-10-12.

## Orsaker som hittades

- Kursövningarnas urval använde bara den senaste nivågruppen, ibland två frågor, och undvek bara den direkt föregående frågan. Det gav växling mellan samma två frågor.
- Flera andra generatorer drog med återläggning: samma fråga kunde väljas igen utan att resten av banken hade använts.
- AI-urvalets nyare frågor och repetitionsfrågor kunde ligga i separata kortlekar, vilket tillät överlappande frågor trots kortlekslogik.
- Stavningsövningen hade tre ord per nivå. Svenska kontext-/ledtrådsbanker hade tre situationer per nivå.
- Quizmotorn hade inget gemensamt skydd mot upprepning och försökte fylla hela den valda rundlängden även när banken var mindre.

## Ändringar

Frågor har stabil identitet som inte ändras när svarsalternativen blandas. Fasta banker använder blandade kortlekar; kortet tas ur återstående urval och kommer inte tillbaka förrän kortleken behöver börja om. Nivåbyte kan skapa ett nytt urval, men quizmotorns separata historik hindrar samma identifierade fråga inom rundan.

Quizmotorn väljer nya frågor före tidigare använda. Historik för de senaste 32 frågorna följer samma profil, app och modul mellan rundor under den aktuella sessionen. Historiken är begränsad i minnet och lagras inte som ytterligare persondata i en permanent frågelogg. En omladdning nollställer den.

Efter högst 32 kandidater används den bästa ännu oanvända frågan i rundan. Om generatorn inte kan ge en ny identifierad fråga avslutas rundan i stället för att repetera. Sammanfattning och belöning beräknas utifrån faktiskt besvarat antal. En tom bank ger en återgångsknapp, ingen tom belönad runda. Detta är en säker reservväg, inte ett bevis på att hela generatorns möjliga utfall räknats upp.

AI använder en gemensam kortlek för introduktions- och nyare frågor. Svårare frågor kan fortfarande prioriteras för äldre, men samma fråga kan inte komma från två parallella kortlekar. Textbaserade fördjupningar ligger från nivå 3 i gränssnittet (intern nivå 2); befintliga bildfrågor för yngre bevaras.

## Aktuellt innehåll

Siffrorna gäller den samlade koden efter samtidig innehållssammanslagning; allt innehåll skapades inte i just detta granskningsvarv.

| Bank | Nuvarande omfattning |
|---|---:|
| Kursövningar: Vetenskap, Biologi, Rymden, Världen, AI, Undra, Lekstaden | 168 situationer; åtta i varje nivågrupp 0, 2 och 4 per ämne |
| AI:s tio ämnesbanker | 189 situationer totalt |
| Svenska: ord i sammanhang | 40 situationer, åtta per nivå |
| Svenska: ledtrådar i text | 40 situationer, åtta per nivå |
| Lyssna och stava | 12 ord per nivå, 60 nivåplaceringar |

Robotens talhopp har också ett större intervall av upprepningar på de lägre nivåerna. Vissa små specialistbanker ger fortsatt kortare rundor tills mer lämpligt innehåll finns. Innehållet ska passa färdigheten och nivån, inte fyllas med samma fråga i annan svarsföljd.

## Verifiering

- Alla frågegeneratorer kontrolleras över tillämpliga nivåer: rundan innehåller unika identifierade frågor eller stoppar när ingen ny hittas.
- Kursbankernas första åtta frågor är olika på varje nivågrupp.
- AI-banker ger minst åtta olika frågor från intern nivå 2.
- Stavningsbanken använder tolv olika ord före omstart.
- Profil-/modulhistorik, identitet vid blandade alternativ och kortlekscykler har separata tester.
- DOM-test med en tvåfrågorsbank och önskad rundlängd åtta slutför två frågor och sammanfattar korrekt 2 av 2.

453 enhets-/DOM-tester passerar, bygget och diff-kontrollen passerar. Den nya quizlogiken är inte visuellt verifierad på publicerad adress i detta varv. Uppgifterna finns lokalt; ingen publicering görs här.

Avsiktlig repetition i skrivträning, val att börja om samma verkstad och återbesök av en lektion är fortsatt tillåtna. Rättningen gäller oavsiktliga frågedubbletter i quizrundor.
