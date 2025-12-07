// Recopilación de ejemplos Node.js en un solo archivo.
// Ejecuta la función que quieras para ver cada demo.
// Uso rápido: DEMO=runBasicHttp node todo/index.js   o   node todo/index.js runBasicHttp

const path = require("path");
const http = require("http");
const url = require("url");
const fs = require("fs");
const events = require("events");
const assetsDir = path.join(__dirname, "assets");

const optional = (name) => {
  try {
    return require(name);
  } catch {
    return null;
  }
};

// HTTP básico: texto plano; abre en navegador y verás "Hello, World!"
function runBasicHttp(port = 3000, host = "127.0.0.1") {
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello, World!\n");
    })
    .listen(port, host, () =>
      console.log(`HTTP básico en http://${host}:${port}`)
    );
}

// Módulo propio + fecha actual; responde fecha y la URL solicitada
function runDateTimeServer(port = 3001, host = "127.0.0.1") {
  const dateTime = () => Date();
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`Fecha y hora: ${dateTime()}<br>URL: ${req.url}`);
    })
    .listen(port, host, () =>
      console.log(`DateTime en http://${host}:${port}`)
    );
}

// Lee query params y muestra valores capturados en la página.
// Ej: http://127.0.0.1:3002/?year=2020&month=june
function runQueryServer(port = 3002, host = "127.0.0.1") {
  http
    .createServer((req, res) => {
      const q = url.parse(req.url, true).query;
      const hasData = Object.keys(q).length > 0;
      const year = q.year || "(sin year)";
      const month = q.month || "(sin month)";
      const json = JSON.stringify(q, null, 2);
      const body = hasData
        ? `<h1>Query recibida</h1><p>year: <b>${year}</b><br>month: <b>${month}</b></p><pre>${json}</pre>`
        : `<h1>Sin data</h1><p>Usa ?year=YYYY&month=MMM</p>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(body);
    })
    .listen(port, host, () =>
      console.log(`Query server en http://${host}:${port}`)
    );
}

// Lee archivo HTML y hace operaciones de fs (demo): responde HTML base y ejecuta CRUD de archivos en /todo/texts
function runFsCrudServer(port = 3003, host = "127.0.0.1") {
  const textsDir = path.join(__dirname, "texts");
  if (!fs.existsSync(textsDir)) fs.mkdirSync(textsDir, { recursive: true });

  http
    .createServer((req, res) => {
      const srcHtml = path.join(assetsDir, "demofile1.html");
      fs.readFile(srcHtml, (err, data) => {
        const body = err ? "<h1>Sin archivo</h1>" : data.toString();
        const info = [
          "Operaciones fs ejecutadas:",
          "- appendFile -> texts/mynewfile1.txt",
          "- open -> texts/mynewfile2.txt",
          "- writeFile -> texts/mynewfile3.txt",
          "- appendFile -> texts/mynewfile1.txt (extra)",
          "- unlink -> texts/mynewfile2.txt",
          "- rename -> texts/myrenamedfile.txt",
        ].join("<br>");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`${body}<hr><p>${info}</p>`);
      });

      const file1 = path.join(textsDir, "mynewfile1.txt");
      const file2 = path.join(textsDir, "mynewfile2.txt");
      const file3 = path.join(textsDir, "mynewfile3.txt");
      const renamed = path.join(textsDir, "myrenamedfile.txt");

      fs.appendFile(file1, "Hello content!", () => {});
      fs.open(file2, "w", () => {});
      fs.writeFile(file3, "Hello content!", () => {});
      fs.appendFile(file1, " Extra texto.", () => {});
      fs.unlink(file2, () => {});
      fs.rename(file1, renamed, () => {});
    })
    .listen(port, host, () => console.log(`FS CRUD en http://${host}:${port}`));
}

// Parseo de URL sin servidor: solo imprime partes de una URL de ejemplo
function inspectSampleUrl() {
  const adr = "http://localhost:8080/default.htm?year=2017&month=february";
  const q = url.parse(adr, true);
  console.log("host      =>", q.host);
  console.log("pathname  =>", q.pathname);
  console.log("search    =>", q.search);
  console.log("month     =>", q.query.month);
}

// Servidor de archivos estáticos (HTML): sirve archivos de assets/ según path
function runStaticFileServer(port = 5000, host = "127.0.0.1") {
  http
    .createServer((req, res) => {
      const pathname = url.parse(req.url).pathname || "/";
      const cleaned = pathname.startsWith("/") ? pathname.slice(1) : pathname;
      const target = cleaned || "summer.html";
      const filename = path.join(assetsDir, target);
      fs.readFile(filename, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404 Not Found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    })
    .listen(port, host, () =>
      console.log(`Servidor estático en http://${host}:${port}`)
    );
}

// Paquete externo: upper-case; responde "HELLO WORLD." si tienes upper-case instalado
function runUpperCaseServer(port = 5001, host = "127.0.0.1") {
  const uc = optional("upper-case");
  if (!uc) throw new Error("Instala upper-case (npm i upper-case)");
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(uc("Hello World."));
    })
    .listen(port, host, () =>
      console.log(`Upper-case en http://${host}:${port}`)
    );
}

// Streams y eventos: lee demofile.txt y dispara un evento custom
function demoStreamsAndEvents() {
  const rs = fs.createReadStream(path.join(assetsDir, "demofile.txt"));
  rs.on("open", () => console.log("Archivo abierto"));

  const eventEmitter = new events.EventEmitter();
  eventEmitter.on("scream", () => console.log("Evento disparado"));
  eventEmitter.emit("scream");
}

// Subida de archivos con formidable: formulario en /, sube a /todo/uploads
function runUploadServer(port = 8080, host = "127.0.0.1") {
  const formidable = optional("formidable");
  if (!formidable) {
    console.log(
      "runUploadServer: formidable no está instalado; se devolverá 501 Not Implemented con instrucciones."
    );
  }

  http
    .createServer((req, res) => {
      if (!formidable) {
        res.writeHead(501, { "Content-Type": "text/plain" });
        res.end("Upload no disponible: instala formidable (npm i formidable) o desactiva este demo.");
        return;
      }

      if (req.url === "/fileupload") {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) {
            res.writeHead(500);
            res.end("Error");
            return;
          }
          const file = files.filetoupload;
          const oldpath = file.filepath || file.path;
          const newpath = path.join(
            __dirname,
            "uploads",
            file.originalFilename || file.name
          );
          fs.mkdirSync(path.dirname(newpath), { recursive: true });
          fs.rename(oldpath, newpath, (renameErr) => {
            if (renameErr) {
              res.writeHead(500);
              res.end("No se pudo mover");
              return;
            }
            res.write("Archivo subido y movido");
            res.end();
          });
        });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        '<form action="fileupload" method="post" enctype="multipart/form-data"><input type="file" name="filetoupload"><br><input type="submit"></form>'
      );
    })
    .listen(port, host, () => console.log(`Upload en http://${host}:${port}`));
}

// Express estático: sirve /todo/static y / index.html si existe
function runExpressStatic(port = 3004) {
  const express = optional("express");
  if (!express) throw new Error("Instala express (npm i express)");
  const app = express();
  app.use(express.static(path.join(__dirname, "static")));
  app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "static", "index.html"))
  );
  app.listen(port, () =>
    console.log(`Express estático en http://localhost:${port}`)
  );
}

// Connect estático: sirve este mismo directorio con connect
function runConnectStatic(port = 1337) {
  const connect = optional("connect");
  if (!connect) throw new Error("Instala connect (npm i connect)");
  const util = optional("util") || require("util");
  connect.createServer(connect.static(__dirname)).listen(port);
  util.puts("Listening on " + port + "...");
  util.puts("Press Ctrl + c to Stop");
}

module.exports = {
  runBasicHttp,
  runDateTimeServer,
  runQueryServer,
  runFsCrudServer,
  inspectSampleUrl,
  runStaticFileServer,
  runUpperCaseServer,
  demoStreamsAndEvents,
  runUploadServer,
  runExpressStatic,
  runConnectStatic,
  runAllServers,
  printMenu,
};

// Levanta todos los servidores en puertos distintos (revisa dependencias opcionales).
function runAllServers() {
  // Arrancan en paralelo; evita puertos ocupados si ya los tienes arriba.
  runBasicHttp();          // 3000
  runDateTimeServer();     // 3001
  runQueryServer();        // 3002
  runFsCrudServer();       // 3003
  runStaticFileServer();   // 5000
  safeRun(runUpperCaseServer, 'upper-case'); // 5001
  runUploadServer();       // 8080
  safeRun(runExpressStatic, 'express');      // 3004
  safeRun(runConnectStatic, 'connect');      // 1337
  inspectSampleUrl();      // solo imprime
  demoStreamsAndEvents();  // solo imprime/evento
}

function safeRun(fn, pkgName) {
  try {
    fn();
  } catch (err) {
    console.log(`No se pudo iniciar ${fn.name}: instala ${pkgName} (npm i ${pkgName}). Error: ${err.message}`);
  }
}

function printMenu() {
  console.log("Menú de demos (copia/pega el comando):");
  console.log("DEMO=runAllServers node todo/index.js        # todos (3000,3001,3002,3003,5000,5001,8080,3004,1337)");
  console.log("DEMO=runBasicHttp node todo/index.js         # http://127.0.0.1:3000/");
  console.log("DEMO=runDateTimeServer node todo/index.js    # http://127.0.0.1:3001/");
  console.log("DEMO=runQueryServer node todo/index.js       # http://127.0.0.1:3002/?year=2020&month=june");
  console.log("DEMO=runFsCrudServer node todo/index.js      # http://127.0.0.1:3003/ (CRUD en todo/texts)");
  console.log("DEMO=runStaticFileServer node todo/index.js  # http://127.0.0.1:5000/summer.html");
  console.log("DEMO=runUpperCaseServer node todo/index.js   # http://127.0.0.1:5001/ (npm i upper-case)");
  console.log("DEMO=runUploadServer node todo/index.js      # http://127.0.0.1:8080/ (npm i formidable)");
  console.log("DEMO=runExpressStatic node todo/index.js     # http://127.0.0.1:3004/ (npm i express)");
  console.log("DEMO=runConnectStatic node todo/index.js     # http://127.0.0.1:1337/ (npm i connect)");
  console.log("DEMO=inspectSampleUrl node todo/index.js     # imprime partes de URL en consola");
  console.log("DEMO=demoStreamsAndEvents node todo/index.js # lee demofile.txt y dispara evento");
}

// Helper CLI simple: selecciona demo por env DEMO o arg.
if (require.main === module) {
  const demos = {
    runBasicHttp,
    runDateTimeServer,
    runQueryServer,
    runFsCrudServer,
    inspectSampleUrl,
    runStaticFileServer,
    runUpperCaseServer,
    demoStreamsAndEvents,
    runUploadServer,
    runExpressStatic,
    runConnectStatic,
    runAllServers,
    printMenu,
    menu: printMenu,
  };

  const pick = process.env.DEMO || process.argv[2];
  if (!pick || !demos[pick]) {
    printMenu();
    process.exit(0);
  }
  console.log("Ejecutando", pick);
  demos[pick]();
}
