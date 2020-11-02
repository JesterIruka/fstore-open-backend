require('dotenv').config();

const colors = require('colors');
const express = require('express');
const cors = require('cors');
const api = require('./src/api');

const server = express();
server.use(cors());
server.use(express.json());



api.fetchStatus().then(res => {
  const { plan, remaining } = res.data;

  console.log(`Store found! Plan: ${colors.cyan(plan)} Remaining days: ${colors.green(remaining)}`);

  server.use(require('./src/routes'));
  server.listen(process.env.PORT || 8080, () => {
    console.log(`🛒 Hosting at port ${process.env.PROT || 8080}`);
  });
}).catch(err => {
  console.error("❌ Couldn't find store assigned to this token");
  process.exit(0);
});