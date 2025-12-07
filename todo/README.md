# Menú de demos con links listos

1) Levantar todo a la vez:  
   `DEMO=runAllServers node todo/index.js`

   Puertos y URLs:
   - runBasicHttp → http://127.0.0.1:3000/
   - runDateTimeServer → http://127.0.0.1:3001/
   - runQueryServer → http://127.0.0.1:3002/?year=2020&month=june
   - runFsCrudServer → http://127.0.0.1:3003/  (CRUD en `todo/texts`)
   - runStaticFileServer → http://127.0.0.1:5000/summer.html
   - runUpperCaseServer → http://127.0.0.1:5001/  (requiere `upper-case`)
   - runUploadServer → http://127.0.0.1:8080/  (requiere `formidable`)
   - runExpressStatic → http://127.0.0.1:3004/  (requiere `express`)
   - runConnectStatic → http://127.0.0.1:1337/  (requiere `connect`)
   - inspectSampleUrl y demoStreamsAndEvents solo imprimen en consola.

1bis) Ver menú rápido (URLs incluidas):  
    `DEMO=menu node todo/index.js`
    ```
    DEMO=runAllServers node todo/index.js        # todos (3000,3001,3002,3003,5000,5001,8080,3004,1337)
    DEMO=runBasicHttp node todo/index.js         # http://127.0.0.1:3000/
    DEMO=runDateTimeServer node todo/index.js    # http://127.0.0.1:3001/
    DEMO=runQueryServer node todo/index.js       # http://127.0.0.1:3002/?year=2020&month=june
    DEMO=runFsCrudServer node todo/index.js      # http://127.0.0.1:3003/ (CRUD en todo/texts)
    DEMO=runStaticFileServer node todo/index.js  # http://127.0.0.1:5000/summer.html
    DEMO=runUpperCaseServer node todo/index.js   # http://127.0.0.1:5001/ (npm i upper-case)
    DEMO=runUploadServer node todo/index.js      # http://127.0.0.1:8080/ (npm i formidable)
    DEMO=runExpressStatic node todo/index.js     # http://127.0.0.1:3004/ (npm i express)
    DEMO=runConnectStatic node todo/index.js     # http://127.0.0.1:1337/ (npm i connect)
    DEMO=inspectSampleUrl node todo/index.js     # imprime partes de URL
    DEMO=demoStreamsAndEvents node todo/index.js # lee demofile.txt y dispara evento
    ```

2) Levantar uno solo:  
   `node todo/index.js <demo>`

   Ejemplos:  
   - `node todo/index.js runBasicHttp`  
   - `node todo/index.js runQueryServer` y visitar http://127.0.0.1:3002/?year=2020&month=june  
   - `node todo/index.js runStaticFileServer` y visitar http://127.0.0.1:5000/winter.html

Dependencias opcionales (solo si usas esas demos):  
`npm i upper-case express connect`  
Formidable es opcional: si falta, `runUploadServer` responde 501 con el mensaje para instalarlo.
