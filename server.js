const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const stringify = require('csv-stringify').stringify
const parse = require('csv-parse').parse
const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");

// lettura del file json contenenti le scuole salvate in precedenza
let lista_scuole = JSON.parse(fs.readFileSync("scuole.json"));// lista locale per lavorare piu' rapidamente

app.use(express.static('public'))

app.use(express.json());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.json());// utilizzo del package json
app.use(express.urlencoded({extended: true}));

// get per visualizzare la pagina principale (client)
app.get('/home', (req, res) => {
  res.render(__dirname + '/views/index.html');
});

// lettura e salvataggio di tutte le scuole presenti nel file csv
let check = true;// variabile per evitare di memorizzare scuole con id uguali
console.log("Lettura del file csv.");
  
// lettura del file csv
fs.createReadStream(__dirname + '/views/dati.csv')
  .pipe(parse({ delimiter: ",", from_line: 2}))// lettura dalla linea 2
  .on("data", function (row) {
    // controllo per scuole con id uguali
    for(let i = 0; i < lista_scuole.length; i++){
      if(row[1] == lista_scuole[i].Id && row[3] == lista_scuole[i].AnnoCorsoClasse){
        check = false;
      }
    }
    // variabile d'appoggio per memorizzare la scuola appena letta
    let s = {
                Id: row[1],
                Grado: row[2],
                AnnoCorsoClasse: row[3],
                Classi: row[4],
                AlunniMaschi: row[5],
                AlunneFemmine: row[6]
            };
    if(check){
      lista_scuole.push(s);
    }
  })
  .on("end", function () {
    // riscrivo il file contenente tutte le scuole
    fs.writeFileSync("scuole.json", JSON.stringify(lista_scuole));
    console.log("Finito.");
  })
  .on("error", function (error) {
    console.log("Errore di lettura.");
  });


// restituisce il file scuole.json
app.get('/restituisci', (req, res) => {
  if(lista_scuole.length == 0){
    res.sendStatus(404);
  } else {
    res.send(lista_scuole);
  }
});

// get per restituire al client una tabella contenente tutte le informazioni delle scuole memorizzate
// computazione lato server
app.get('/tabella', (req, res) => {
  console.log("Carica tabella");
  var html = '<table border="1" class="table">';
  html += '<tr> <th>#</th><th> Id </th><th> Grado </th><th> Anno di corso </th><th> Classi </th><th> Alunni maschi </th><th> Alunni femmine </th> </tr>';
  for(let i = 0; i < lista_scuole.length; i++){
    html += '<tr>';
    html += '<td>' + (i+1) + '</td><td>' + JSON.stringify(lista_scuole[i].Id) + '</td><td>' + JSON.stringify(lista_scuole[i].Grado) + '</td>' + 
            '<td>' + JSON.stringify(lista_scuole[i].AnnoCorsoClasse) + '</td>' + '<td>' + JSON.stringify(lista_scuole[i].Classi) + 
            '</td><td>' + JSON.stringify(lista_scuole[i].AlunniMaschi) + '</td>' +
            '<td>' + JSON.stringify(lista_scuole[i].AlunneFemmine) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  res.send(html); 
});

// restituisce la scuola in posizione i-esima
app.get('/search', (req, res) => {
  const i = req.query.index;
  if(lista_scuole.length < i && i <= 0){
    res.type('text/plain').send("Indice non coerente con il numere delle scuole.");
    res.sendStatus(406);
  }else{
    res.json(lista_scuole[i - 1]);
  }
});

// endpoint per aggiungere una scuola all'elenco
app.post('/add', (req, res) => {
  let check = true;// variabile utilizzata per non inserire scuole con id uguali
  const nuovaScuola = req.body;
  for(let i = 0; i < lista_scuole.length; i++){
    if(nuovaScuola.Id == lista_scuole[i].Id && nuovaScuola.AnnoCorsoClasse == lista_scuole[i].AnnoCorsoClasse){
      check = false;
    }
  }
  if(check){
    lista_scuole.push(nuovaScuola);
    // riscrittura del file
    fs.writeFileSync("scuole.json", JSON.stringify(lista_scuole));
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// endpoint per modificare un paramentro, o piu', di una scuola
app.put('/update', (req, res) => {
  const i = req.query.position - 1;
  console.log(i);
  const scuolaTmp = req.body;
  let indiceTmp; 
  let check = false;
  console.log(scuolaTmp);
  if(i <= lista_scuole.length && i >= 0){
    lista_scuole[i] = scuolaTmp;
    fs.writeFileSync("scuole.json", JSON.stringify(lista_scuole));
    res.sendStatus(200);
  } else {
    res.sendStatus(406);
  }
});

// endpoint per rimuovere una scuola dal sistema, dato un indice
app.delete('/remove', (req, res) => {
  const i = req.query.position - 1;// per eliminare il record effettivo che l'utente vede
  if(i <= lista_scuole.length && i >= 0){
    // rimuzione dell'elemento dalla lista locale
    lista_scuole.splice(i, 1);
    // riscrittura del file json con le scuole correnti
    fs.writeFileSync("scuole.json", JSON.stringify(lista_scuole));
    res.sendStatus(200);
  }else{
    res.sendStatus(406);
  }
});

app.listen(process.env.PORT || 4000, () => console.log("Server listen on " + process.env.PORT));