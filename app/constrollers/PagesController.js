/**
 * PagesController - Serve views
 * @author krthr
 * @since 1.0.0
 */

const { reportError } = require("./../services/raven");
const PagesRouter = require("express").Router();
const apiService = require('../services/apiService')
const api = new apiService()

/**
 * Is the user logged?
 */
const isLogged = (req, res, next) => {
  // req.isAuthenticated()
  if (
    req.session.tokens ||
    req.body.tokens ||
    req.session.done ||
    req.session.user
  )
    next();
  else return res.redirect("/");
};

/**
 * [GET] Login page
 */
PagesRouter.get("/", (req, res) => {
  // console.log(req.session.user)

  if (req.session.user) return res.redirect("/auth/google");
  return res.render("pages/index", {
    title: "MiHorario",
    message: req.flash("error")[0],
    notice:
      "¡Hey! Ya corregimos el error con las clases que inician a las 6:30PM. Por favor, intenta de nuevo ;)"
  });
});

/**
 * [GET] Serve and select subjects
 */
PagesRouter.get("/subjects", isLogged, async (req, res) => {
  try {
    const calendar = await  api.getCalendar(
      req.session.user.userId,
      req.session.user.user,
      req.session.user.pass
    );

    req.session.user.sections = calendar.terms[0].sections;

    return res.render("pages/subjects", {
      title: "Seleccionar materias",
      sections: calendar.terms[0].sections,
      tokens: JSON.stringify(req.session.tokens)
    });
  } catch (er) {
    reportError(er, {});
    // console.log(er)
    return res.redirect("/");
  }
});

/**
 * [GET] Subjects added to the calendar
 */
PagesRouter.get("/done", isLogged, (req, res) => {
  return res.render("pages/done", {
    title: "¡Listo!"
  });
});

module.exports = PagesRouter;
