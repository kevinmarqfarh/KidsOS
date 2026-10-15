# Dialoger och Frågekort – buggfix 2026-10-15

Tre agenter granskade dialoglager, Undra och ändringarna oberoende. Användarens iPhone-bild visade appknappar framför bekräftelsen för användarbyte. Aktuell Chrome reproducerade inte just den övermålningen före ändringen. Kodgranskningen visade däremot att vanliga överlägg hade lägre lagerordning än datorappens helskärmsfönster.

Åtgärder:
- Gemensamma bekräftelser använder native modal dialog/showModal, vilket ger webbläsarens översta lager. Reservlagret ligger också över appens helskärmsfönster.
- Dialogmått, fokus, Escape, stängning och nästlade dialogers värd hanteras. Bakgrundens tidigare inert-status återställs.
- Frågekorts uppläsning använder samma åldersanpassade svar som den synliga svarssidan.
- Visste du-kort är tangentbordsåtkomliga knappar och väljs bland profilens tillgängliga frågor.

Verifiering:
- 510/510 automatiska tester passerade, inklusive sex nya regressionstester. Produktionsbygget passerade.
- Publicerad Chrome: native :modal bekräftad; Stanna och Escape stängde och återställde fokus till Byt användare; Byt öppnade profilväljaren. Samma användarbyte fungerade i datorläge.
- Paus i datorappens helskärm öppnade native modal och Fortsätt fungerade.
- Faktakort öppnades med Enter till rätt fråga. Ingen varning eller felpost i fångad webbläsarlogg.
- 390×844, 320×568 och 568×320: bekräftelsens båda knappar synliga. Vid 320 px var panelen 304 px bred utan sidöverflöde. Datorformat 1280×800 granskades också.
- Bilder finns i audit-dialogs-2026-10-15. Testprofilen återställdes till Tablet och tillfällig fönsterstorlek återställdes.

Fysisk Safari, iPhone-tangentbord och tidsgräns→föräldrakod provades inte i webbläsaren under detta varv; nästlade dialoger och fallback täcks av automatiska tester. Detta är en riktad bugggranskning, inte ett intyg om att hela appen saknar buggar.
