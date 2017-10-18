const keys = require('./config/keys')
const express = require('express');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

const port = process.env.PORT || 5000;

// Handlebar middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// Set static folder
app.use(express.static(`${__dirname}/public`))

// Index Route
app.get('/', (req,res) => {
    res.render('index', {
        stripePublishablekey: keys.stripePublishablekey
    })
})

// Charge Route
app.post('/charge', (req,res) => {
    const amount = 5000
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description: 'Chelsea 2017/2018 Kit',
        currency: 'usd',
        customer: customer.id
    })).then(charge => res.render('success'))
})

app.listen(port,() => {
    console.log(`server started on port ${port}`);
})