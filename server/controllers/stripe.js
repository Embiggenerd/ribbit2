const stripe = require("stripe")("sk_test_pvfx8vd9zb2O30gcsroRwieK");
const UserModel = require("../models/Users");
// module.exports = {
//   pay: async (req, res, next) => {
//     const charge = await stripe.charges.create({
//       amount: 500,
//       currency: 'usd',
//       description: '5 dollars for 5 ribs',
//       source: req.body.id
//     });
//     req.user.credits += 5;
//     const user = await req.user.save();
//     res.send(user);
//   }
// };
module.exports = {
  pay: async (req, res, next) => {
    try {
      await stripe.charges.create({
        amount: 500,
        currency: "usd",
        description: "5 dollars please",
        source: req.body.id
      });
      const user = await UserModel.findOne({ id: req.id });
      user.credits += 5
      const savedUser = await user.save()
      res.send(savedUser);
    } catch (e) {
      res.status(500).send(e);
    }
  }
};
// // make sure user is authenticated

// pass token to stripe

// call stripe's create charge function
