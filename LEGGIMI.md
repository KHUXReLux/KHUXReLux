# Pagina del progetto KHUXReLux

Sito statico, in inglese, senza build: si modifica un file, si fa commit e push, e GitHub Pages lo aggiorna.
L'unica immagine del gioco e' lo sfondo ufficiale in `assets/hero.jpg` (con la copia sfocata `assets/bg.jpg`): e' arte promozionale © Disney / Square Enix, citata nel piè di pagina e nell'avviso. Il resto e' CSS e SVG. Se non vuoi usarla, togli le due `url(assets/...)` da `style.css` e le frasi sull'artwork da `index.html`.

| File | A cosa serve |
|---|---|
| `index.html` | La pagina: i pulsanti Home, Status, Log, Server e Credits (cinque schede); la Home contiene anche How to play, How you can help |
| `style.css` | L'aspetto: intestazione con lo sfondo ufficiale, pannelli di vetro viola, pulsanti lucidi blu e arancioni, tag colorati come nelle Notices del gioco (idee dal portale di Kxos) |
| `assets/tabs/` | I cinque pulsanti dei menu (QuestBut1..5, On = scheda scelta, Off = le altre), presi dai file del gioco (JP 4.3.1) e rimpiccioliti. Nell'ordine: Home, Status, Log, Server, Credits |
| `assets/fonts/` | `KH2_ALL_MENU_I.ttf`, il font dei menu di KH2 preso dal gioco: e' usato solo per il titolo KHUXRelux (solo maiuscole, niente simbolo χ) |
| `assets/footer/` | Chirishi (sinistra) e l'avatar (destra) in fondo a ogni pagina |
| `assets/titles/` | I titoli word-art del gioco usati sulle targhe: Home = MENU (Menu_Title), Status = STATUS (Av_Title), Log = INFORMATION (Info_Title), Server = TALK (Chat_Title), Credits = REWARD (Raid_List_Title_Reward) |
| `assets/frames/` | `plate.png` (targa dorata, Colosseum_Period_Panel) e `subbar.png` (barra azzurra dei sottotitoli, Deck_Subtitle_01) |
| `assets/icons/` | Le icone accanto ai titoli delle pagine (MyMission_Crown, SpIcon_Target_MDL1, SpIcon_Target_COST, My_Switch_Party, Ticket_Skip_Icon), tutte portate nella stessa scatola |
| `assets/` | `hero.jpg` (sfondo nitido dell'intestazione) e `bg.jpg` (stessa immagine sfocata e scurita, dietro la pagina) |
| `LICENSE-site.txt` | Licenza MIT di Kxos: la grafica e la struttura della pagina derivano dal suo portale, la nota va tenuta |
| `app.js` | Schede, legge i file `.json` e li mostra (struttura dallo script di Kxos) |
| `status.json` | **Lo stato delle aree** (sezione Status) |
| `changelog.json` | **Il registro delle modifiche** (sezione Changelog), la piu' recente per prima |

## Come pubblicarla su GitHub Pages (quando vuoi tu)
1. Crea un repository su GitHub (nome a scelta) e metti dentro **il contenuto di questa cartella**.
2. Nelle impostazioni del repository: Pages, sorgente = branch `main`, cartella `/ (root)`.
3. Dopo uno-due minuti la pagina e' su `https://<tuo-utente>.github.io/<nome-repo>/`.
Il file `.nojekyll` serve a GitHub per non rielaborare i file.

## Come aggiornarla
- **Stato:** modifica `status.json`. Ogni area ha `state` = `done` (Works today), `progress` (In progress) o `missing` (Not there yet); `done`/`total`/`unit` disegnano la barra; `tags` = `ORIGINAL`, `REBUILT` (ricostruito da riferimenti come la wiki) o `OWN DESIGN` (regole nostre); le schede Home e Help us sono HTML in `index.html`. Aggiorna anche `updated`, `revision` e, se serve, `summary`.
- **Changelog:** aggiungi una voce **in cima** a `changelog.json` (`date`, `revs`, `title`, `kind`, `items`; `kind` = `new` viola, `event` azzurro, `update` verde, `important` rosso, `info` blu). Nelle voci, `**testo**` all'inizio di una riga diventa grassetto.
- Dopo aver cambiato `style.css` o `app.js`, aumenta il numero dopo `?v=` in `index.html`, cosi' i browser non usano la copia vecchia.

## Cose da personalizzare prima di pubblicare
- **Scheda Server:** e' una pagina della barra (non piu' un link diretto) con «Get in touch»: il pulsante «KHUXReLux Discord» punta a `https://discord.com/channels/1525747384984801300/` (un link di canale: lo apre solo chi e' gia' nel server; per invitare altre persone serve un link d'invito `discord.gg/...`). Lo stesso blocco ha i link a Re-Union X.
- Nella sezione **Credits** e **Play** non c'e' nessun tuo nome, ne' link a un tuo profilo o Discord: ho scritto solo i crediti che posso verificare. Se vuoi un contatto, aggiungilo tu in `index.html`.
- La sezione **Play** dice di proposito che non ci sono download pubblici e che il sito non ospita file di gioco. Se un giorno cambia, va aggiornata.
- Controlla che i crediti (Kxos, thethiny, Roboloid, KHUX Wiki) siano come vuoi e che Kxos sia d'accordo a essere nominato.

## Prova in locale
Dalla cartella: `python -m http.server 8000` e apri `http://127.0.0.1:8000/`. Aprendo `index.html` direttamente dal disco i file `.json` non si caricano.
