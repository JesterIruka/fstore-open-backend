const express = require('express');
const api = require('./api');

const router = express.Router();

let categories = [];
let products = [];
let coupons = [];
let players = [];

async function fetchAll() {
  categories = (await api.get('/categories')).data;
  products = (await api.get('/products')).data;
  coupons = (await api.get('/coupons')).data;
}

setInterval(async () => {
  players = (await api.get('https://five-m.store/loja/'+process.env.SLUG+'/players')).data;
}, 60000);

fetchAll().then(() => setInterval(fetchAll, 300000));

router.get('/players', (_, res) => res.json(players));
router.get('/categories', (_, res) => res.json(categories));
router.get('/products', (_, res) => res.json(products));

router.get('/coupon/:name', (req, res) => {
  const { name } = req.params;

  const coupon = coupons.find(c => c.name === name);

  return res.status(coupon?200:404).json(coupon);
});

/*
{
  payer: {
    name: 'Nome completo',
    email: 'email@example.com',
    player: 3,
    discord: null, // só mandar se tiver o bot
  },
  cart: [produto1, produto2],
  coupon: null, // name
  gateway: 'mercadopago',
  variations: {
    "3119": "s1000rr"
  }
}
 */

router.post('/checkout', async (req, res) => {
  const { payer,cart,coupon,gateway,variations } = req.body;

  if (cart.length === 0) return res.status(400).json({error: 'Carrinho vazio'}).send();

  const response = await api.post('/checkout', {
    payer,cart,coupon,gateway,variations
  });

  //enviando { link: "url-para-redirect" }
  return res.status(201).json(response.data).send();
});


module.exports = router;