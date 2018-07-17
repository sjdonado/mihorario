const PagesRouter = require('express').Router()
const {
  getCalendar
} = require('./../services/api')

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else return res.redirect('/')
}

PagesRouter.get('/',(req, res) => {
  if (req.isAuthenticated()) return res.redirect('/auth/google')
  return res.render('pages/index', {
    title: 'MiHorario'
  })
})

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