const { formidable } = require("formidable");

const fileParser = async (req, res, next) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
    return res.status(422).json({ error: "only accepts formdata" });

  const form = formidable({
    multiples: false,
    filename(name, ext, part) {
      return Date.now() + "_" + part.originalFilename;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    // console.log(fields);

    let transformedFields = {};

    for (const field in fields) {
      transformedFields[field] = `${fields[field]}`;
    }
    // console.log(transformedFields);
    req.body = transformedFields;
    req.files = files;

    next();
  });
};

module.exports = fileParser;
