/** Sets the languge cookie in base a the "lang" request parameter.
 */
module.exports = function (req, res, next) {
  var lang = req.param("lang");
  var cookieOptions = {
    maxAge: 157680000000
  };

  if (lang) {
    res.cookie("lang", lang, cookieOptions);
    res.redirect("/");
  } else {
    next();
  }
};
