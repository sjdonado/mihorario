/**
 * PagesController - Serve views
 * @author krthr
 * @since 1.0.0
 */

const PagesRouter = require('express').Router()
const {
  getCalendar
} = require('./../services/api')

/**
 * Is the user logged?
 */
const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else return res.redirect('/')
}

/**
 * [GET] Login page
 */
PagesRouter.get('/',(req, res) => {
  if (req.isAuthenticated()) return res.redirect('/auth/google')
  return res.render('pages/index', {
    title: 'MiHorario',
    message: req.flash('error')[0]
  })
})

/**
 * [GET] Serve and select subjects
 */
PagesRouter.get(
  '/subjects',
  isLogged,
  async (req, res) => {

    try {
      const calendar = await getCalendar(
        req.user.userId,
        req.user.u,
        req.user.p
      )

      req.user.sections = calendar.terms[0].sections

      return res.render('pages/subjects', {
        title: 'Seleccionar materias',
        sections: calendar.terms[0].sections
      })
    } catch (er) {
      return res.redirect('/')
    }

  }
)

/**
 * [GET] Subjects added to the calendar
 */
PagesRouter.get(
  '/done',
  isLogged,
  (req, res) => {
    return res.render('pages/done', {
      title: '¡Listo!'
    })
  }
)

module.exports = PagesRouter