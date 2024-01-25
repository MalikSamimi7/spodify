const yup = require("yup");
const validater = (schema) => {
  return async (req, res, next) => {
    if (!req.body) return res.json({ error: "empty body is not accepted" });
    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        { abortEarly: true }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.json({
          error: error.message,
        });
      }
    }
  };
};
module.exports = validater;
