// configurando o server
const express = require('express');
const server = express();

//configurar servidor para apresentar arquivos extras
server.use(express.static('public'));

//habilitar bod do formulario
server.use(express.urlencoded({extended:true}));

//configurar conexão com o banco
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5433,
    database: 'doe'
});


// configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true
});

// configurar  apresentação da pagina
server.get('/',(req, res) => {

    db.query("SELECT * FROM donors", (err, result) => {
        if (err) {
            return res.send("erro no banco de dados");
        }
        const donors = result.rows;
        return res.render('index.html', { donors });
    });
});

// pegar dados do formulario
server.post('/',(req,res) => {
   const {name, email, blood} =  req.body;
   
   
   if (name == "" || email == "" || blood == "") {
     return res.send('Preencha todos os campos para validar o envio');    
   }
   
   const query = `INSERT INTO donors ("name","email","blood") VALUES ($1, $2, $3)` ;
   const values = [name, email, blood];
   
   db.query(query,values, (err) => {
        // fluxo de erro
        if (err) return res.send("erro no banco de dados");
        // fluxo ideal
        return res.redirect('/');
    
    });    
});

// ligar p servidor e permitir o acesso na porta
server.listen(3000, () => {
    console.log('Rodando npm start');
})
