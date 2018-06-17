const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      // validate req against schema. If validation fails,
      // return out of function. Else attach value object
      // to req, and attach req.body object to req.value.object,
      // meaning req auth is valid if there is a value object attached.
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
