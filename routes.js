const express = require('express');
const router = express.Router();

const socket = require('socket.io');
let socketServer;

const clients = [];

router.post('/personalizacao/new', async (req, res) => {
   try {
      clients.forEach((item) => {
         item.emit(req.body.empresa, req.body);
      });

      res.status(200).json('sucess');
   } catch (error) {
      console.log('🔥 - personalizacao/new - Error:' + error);
      res.status(500).json('error');
   }
});

router.get('test-local', (req, res) => {
   res.send('deu muito bom clonando o repositorio.');
});

module.exports = {
   configure: (server) => {
      socketServer = server;

      socketServer.on('connection', (client) => {
         console.log('Opa Conectei!');
         console.log(client.id);
         clients.push(client);

         client.on('disconnect', () => {
            clients.splice(clients.indexOf(client), 1);
         });
      });
   },
   router,
};
