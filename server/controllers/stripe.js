const stripe = require('stripe');

module.exports = {
  pay: async (req, res, next) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '5 dollars for 5 ribs',
      source: req.body.id
    });
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  }
};
// make sure user is authenticated

// pass token to stripe

// call stripe's create charge function
