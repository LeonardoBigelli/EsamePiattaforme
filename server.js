const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const stringify = require('csv-stringify').stringify
const parse = require('csv-parse').parse
const fs = require('fs');
const path = require('path');
//const jsdom = require("jsdom");
// lettura file scuole.json
const r = fs.readFileSync("scuole.json");
var parser = JSON.parse(r);

var lista_scuole = new Array();

app.use(express.static('public'))

app.use(express.json());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.json());// utilizzo del package json
app.use(express.urlencoded({extended: true}));

// get per pagina principale
app.get('/home', (req, res) => {
  res.render(__dirname + '/views/index.html');
});

// get per ottenere tutte le scuole
app.get('/scuole', (req, res) => {
  console.log("Lettura del file csv.");
  // variabile d'appoggio per memorizzare tutte le scuole
 // const lista_scuole = [];
 // const grado = [];
  
  // lettura del file csv, saparando tutte le scuole
  fs.createReadStream(__dirname + '/views/dati.csv')
    .pipe(parse({ delimiter: ",", from_line: 2}))
    .on("data", function (row) {
      console.log("Riga corrente " + row);
      console.log("Id: " + row[1]);
      console.log("Grado: " + row[2]);
      let s = {
                  Id: row[1],
                  Grado: row[2],
                  Classi: row[4],
                  AlunniMaschi: row[5],
                  AlunneFemmine: row[6]
              };
     lista_scuole.push(s);
     parser.push(/*lista_scuole*/s);
     //grado.push(row[2]);
    })
    .on("end", function () {
      
    //  parser.push(lista_scuole);
     // var json = JSON.stringify(lista_scuole);
      fs.writeFileSync("scuole.json", JSON.stringify(parser));//, (err) => {
        //if(err)
         // console.log("Errore.");
        //else 
        //  console.log("Successo.");
      //});
      console.log("Finito.");
      res.sendStatus(200);
 //     fs.writeFileSync(path.resolve(__dirname, "scuole.json"), JSON.stringify(lista_scuole));
 //     return res.json({scuole: lista_scuole})
    })
    .on("error", function (error) {
      console.log("Errore di lettura.");
      return res.sendStatus(404);
    });
});

// restituisce il file scuole.json
app.get('/restituisci', (req, res) => {
  if(r.length == 0){
    res.sendStatus(404);
  } else {
    res.send(parser);
  }
});

// NON FUNZIONA
app.get('/tabella', (req, res) => {
  var html = '<table>';
  html += '<tr> <th>Anno scolastico</th><th>Codice identificativo</th><th></th> </tr>';
 // document.getElementById("tabella").innerHTML = html; 
});

// restituisce la scuola in posizione i-esima
app.get('/search', (req, res) => {
  const i = req.query.index;
  if(parser.length < i){
    res.type('text/plain').send("Indice non coerente con il numere delle scuole.");
    // rimandare lo status -> conflitti tra due send
  }else{
    res.json(parser[i]);
  }
});

// endpoint per aggiungere una scuola all'elenco
app.post('/add', (req, res) => {
  const nuovaScuola = req.body;
 // console.log(nuovaScuola);
  lista_scuole.push(nuovaScuola);
  parser.push(nuovaScuola);
  fs.writeFileSync("scuole.json", JSON.stringify(parser));
  res.send("Scuola aggiunta con successo.");
});

// PROBLEMA NEL RIAGGIORNARE IL FILE JSON ORIGINALE
app.delete('/remove', (req, res) => {
  const i = req.query.position;
  console.log(r.length);
  console.log(i);
  if(r.length >= i && i >= 0){
    parser.splice(parser[i], 1);// rimuovi l'elemento
    // aggiorno il JSON originale
    fs.writeFileSync("scuole.json", "[]");
    fs.writeFileSync("scuole.json", JSON.stringify(parser));
    res.send("Successo.");
  }else{
    res.send("Errore, indice incorretto.");
//    res.sendStatus(404);
  }
});

app.listen(process.env.PORT || 4000, () => console.log("Server listen on " + process.env.PORT));