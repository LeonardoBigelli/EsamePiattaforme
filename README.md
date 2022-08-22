# Gestionale delle scuole paritarie
## Progetto di Piattaforme Digitali per la gestione del Territorio

Leonardo Bigelli   
Matricola: 307059

### Scopo del servizio implementato

Il servizio permette di gestire un insieme di dati inerenti alle scuole paritarie italiane.
L'insieme di dati è stato reperito dal sito "dati.istruzione.it", esso infatti fa parte della categoria degli opendata fornito
in formato csv.
Al suo interno sono presenti i codici identificativi delle scuole con il numero di studenti maschi e femmine iscritto
in uno specifico anno di corso.
In dettaglio, è possibile inserire nuove scuole, modificare quelle presenti oppure effettuare una eliminazione.

### Descrizione dell'architettura

Il servizio è basato sull'architettura client-server. Il server è stato realizzato tramite l'utilizzo dalla piattaforma
"Glitch.com". 
#### Scelte implementative:
1. Durante l'avvio del server viene caricato il file csv e il suo contenuto viene convertito e salvato in un file JSON;
2. Sono presenti dei controlli per evitare di inserire un nuovo record avente identificativo della scuola e anno di corso
    già presenti all'interno del sistema;
3. La scelta di convertire il file iniziale (csv) nel formato JSON è data da una maggiore facilità nel elaborare i dati 
    in seguito;
4. Nel server.js è presente una variabile locale "lista_scuole" utilizzata per memorizzare, nella sessione attuale, tutte 
    le scuole presenti nel sistema. Questa strategia è utile per facilitare i controlli,infatti evita di andare a rileggere
    il file JSON ogni volta.
5. Alcuni endpoint non vengono utilizzati dal client fornito (index.html) in quanto non sono necessari. In particolare 
    non vengono sfruttati l'endpoint per visualizzare un contenuto in singolo in quanto il client fornisce una rappresentazione
    grafica tramite tabella e tutte le informazioni possono essere consultate tramite quest'ultima. Discorso equivalente per 
    l'endpoint che restituisce tutto il contenuto memorizzato nel file JSON. Tuttavia sono presenti come API in quanto potrebbe 
    non essere reperibile il client per una qualsiasi motivazione.

### Ducumentazione dell'API fornita 

Di seguito sono riportate tutte le API che il servizio fornisce con una descrizione dettagliata del loro funzionamento.
* GET:

 1. /home --> Permette di caricare la pagina principale del servizio che fungerà anche da client;
 2. /restituisci --> Fornisce l'elenco di tutti i dettagli delle scuole presenti nel sistema in formato JSON. 
   In caso di assenza di dati verrà restituito il codice di errore 404;
 3. /tabella --> Con questo endpoint il server realizzerà una tabella in stile html con tutti i dati presenti nel sistema 
   e restituirà appunto una stringa che se interpretata da un browser permetterà la visualizzazione di una tabella. 
   La computazione di questa operazione richiederà qualche secondo in quanto la mole del OpenData è abbastanza significativa
   (> 14000 dati);
 4. /search --> Tramite il passaggio di un'indice permette di restituire in formato JSON i dettagli della scuola della
   posizione specificata. L'endpoint deve essere chiamato nel seguente formato "/search?index=...". In caso di indice non valido
   verrà restituito l'errore codificato 406, altrimenti restituirà il JSON dell'informazione richiesta.
   
* POST:
 1. /add --> Permette l'inserimento nel sistema (file JSON) di nuove informazioni inerenti al numero di studenti di un 
    determinato anno di corso di una scuola. Il passaggio dei dati deve essere effettuato tramite una richiesta POST con tutti i
    dati presenti nel Body della richiesta stessa. In caso di esito positivo il sistema restituirà il codice 200 e i nuovi
    dati verranno memorizzati nel file JSON. In caso contrario verrà restituito il codice 400 se si stia cercando di 
    inserire un dato già presente.
    
* PUT:
 1. /update --> Permette la modifica dei dati di una scuola tramite un indice fornito. Questo endpoint deve essere formattato
    in questo modo "/update?position=..." e come contenuto nella richiesta bisogna passarli il nuovo dato che poi verrà
    utilizzato per sovrascivere il contenuto nella posizione scelta. Restituisce il codice 200 in caso di successo e 406 in caso 
    di indice non corretto.
    
* DELETE
 1. /remove --> Permette l'eliminazione di un record presente nel file JSON.Restituisce il codice 200 in caso di successo e 406 in caso 
    di indice non corretto.
    
### Messa online del servizio

Il server non è sempre attivo. Per abilitare il tutto è necessario accedere alla piattaforma Glitch.com e aspettare qualche
istante affinché il server parta. Il client potrebbe essere poco reattivo in quanto i dati da visualizzare non sono pochi, 
come descritto in precedenza.

### Test del sistema

Seguono vari test effettuati attraverso il client raggiungibile attraverso il seguente endpoint https://gestione-scuole.glitch.me/home .

1. Pagina del client:
  ![Test 1](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/home.png?v=1661173227978)
  
2. Visualizzazione della tabella:     
  Premendo il pulsante "Visualizza tabella" è possibile visualizzare tutti i dati salvati nel sistema. Necessario
  qualche istante per elaborare le informazioni.
  ![Test 2](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Tabella.png?v=1661173281676)
  
3. Inserimento di una scuola:   
  Compilando i campi presenti sulla destra della pagina e premendo il bottone "Inserisci scuola" verrà
  inserita una scuola nel sistema e dopo qualche istante sarà possibile visualizzarla in fondo alla tabella.
  QUest'ultima si aggiornerà da sola.
  ![Test 3](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Inserimento.png?v=1661173238399)
  
4. Inserimento errato:     
  Se non vengono inseriti correttamente tutti i campi necessari per l'inserimento l'operazione verrà
  rifiutata.
  ![Test 4](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Inserimento_errato.png?v=1661173248853)
  
5. Modifica di una scuola:   
  Inserendo i nuovi valori da assegnare alla scuola e la relativa riga della tabella, una volta premuto il tasto di
  modifica verrà sovrascritto il dato presente nel sistema e successivamente la tabella sarà ricaricata.
  ![Test 5](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Modifica.png?v=1661173259863)
  
6. Modifica errata:   
  Se non viene segnalato il numero della riga da voler modificare l'operazione verrà annulata.
  ![Test 6](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Modifica_errata.png?v=1661173280495)
  
7. Eliminazione di una scuola:    
  Inserendo il numero della riga della tabella da voler eliminare e premendo il tasto "Elimina scuola",
  verranno eliminate dal sistema le informazioni riguardanti alla scuola in questione. La tabella poi
  verrà aggiornata in automatico.
  ![Test 7](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Eliminazione.png?v=1661173215479)
  Come si può notare la riga 14829 non è più presente.
  
8. Eliminazione errata:   
  Se l'indice inserito non dovesse essere corretto verrà restituito un errore, ovvero valore non accettabile.
  ![Test 8](https://cdn.glitch.global/86045b4a-8134-4865-a556-ddd433e034eb/Eliminazione_errata.png?v=1661173224287)
  
  
L'esito di tutte le operazioni eseguite dal client è segnalato con un messaggio. Quest'ultimo rappresenta 
il codice che restituisce il server a seconda dell'esito riscontrato.