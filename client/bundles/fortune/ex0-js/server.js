var veyron = require('veyron');
var vom = require('vom');

/**
 * 1) Implement a simple fortune service
 */

var fortuneService = {
  // List of fortunes
  fortunes: [],

  numFortunesServed: 0,

  // Gets a random fortune
  getRandomFortune: function(ctx) {
    var numExistingfortunes = this.fortunes.length;
    if(numExistingfortunes === 0) {
      throw new Error('Sorry! No fortune available :(');
    }
    var randomIndex = Math.floor(Math.random() * numExistingfortunes);
    var fortune = this.fortunes[randomIndex];
    this.numFortunesServed++;
    console.info('Serving:', fortune);
    return fortune;
  },

  // Adds a new fortune
  addNewFortune: function(ctx, fortune) {
    if(!fortune || fortune.trim() === '') {
      throw new Error('Sorry! Can\'t add empty or null fortune!');
    }
    console.info('Adding:', fortune);
    this.fortunes.push(fortune);
  },

  // Describes the fortune service.
  // TODO(alexfandrianto): The correct way to do this is to generate the JS code
  // from the VDL file and inherit from the generated service stub.
  _serviceDescription: {
    methods: [
      {
        name: 'GetRandomFortune',
        outArgs: [
          {
            type: vom.Types.STRING
          }
        ]
      },
      {
        name: 'AddNewFortune',
        inArgs: [
          {
            name: 'fortune',
            type: vom.Types.STRING
          }
        ],
        outArgs: []
      }
    ]
  }
};

/**
 * 2) Publish the fortune service
 */

// Create a Vanadium runtime using the configuration
veyron.init().then(function(rt) {
  var server = rt.newServer();
  // Serve the fortune server under a name. Serve returns a Promise object
  server.serve('bakery/cookie/fortune', fortuneService).then(function() {
    console.log('Fortune server serving under: bakery/cookie/fortune');
  }).catch(function(err) {
    console.error('Failed to serve the fortune server because:\n', err);
    process.exit(1);
  });
}).catch(function(err) {
  console.error('Failed to start the fortune server because:\n', err);
  process.exit(1);
});

// Let's add a few fortunes to start with
[
  'The fortune you seek is in another cookie.',
  'Everything will now come your way.',
  'Conquer your fears or they will conquer you.'
].forEach(function(fortune) {
  fortuneService.addNewFortune(null, fortune);
});
