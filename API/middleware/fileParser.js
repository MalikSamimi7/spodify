const { formidable } = require("formidable");

const fileParser = async (req, res, next) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
    return res.status(422).json({ error: "only accepts formdata" });

  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    req.body = fields;
    req.files = files;

    next();
  });
};

module.exports = fileParser;
