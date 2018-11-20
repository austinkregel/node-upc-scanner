require('fringejs')
const readline = require('readline');
const axios = require('axios')
const Router = app.make('Router');
const _ = require('underscore');
let shoppingLists = [];

Router.express.use(require('body-parser').json())
Router.put('/api/list/:id', (req, res) => {
  if (typeof shoppingLists[req.params.id] !== 'object') {
    shoppingLists[req.params.id] = []
  }

  let searched = _.where(shoppingLists[req.params.id], { upc: req.body.upc });

  if (searched.length >= 1) {
    searched[0].count += 1
  } else {
    shoppingLists[req.params.id].push({
      name: req.body.name,
      upc: req.body.upc,
      count: 1
    })
  }
  return shoppingLists[1]
})

Router.get('/api/list', () => shoppingLists[1])

Router.listen(4000)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async function (line) {
  try {
    let { data } = await axios.get('https://api.upcitemdb.com/prod/trial/lookup?upc=' + line)
    for (let key in data.items) {
      axios.put('http://localhost:4000/api/list/1', {
        name: data.items[key].title,
        upc: line,
      })
    }
  } catch (e) {
    console.log(e)
  }
})

