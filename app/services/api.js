/**
 * ApiService - Conection between app and U Api
 * @author krthr
 * @since 1.0.0
 */

const http = require('axios').default
const fetch = require('node-fetch').default

const BASE = process.env.API_BASE
const CODE = `${BASE}${process.env.CODE}`
const CALENDAR = `${BASE}${process.env.CALENDAR}`
const SUBJECT = `${BASE}${process.env.SUBJECT}`

/**
 * Ger user code (Ex: 200089014)
 * @param {string} user Username
 * @param {string} pass Password
 */
const getUserCode = async (user, pass) => {
  const userCode = await http(CODE, {
    auth: {
      username: user,
      password: pass
    },
    method: 'POST'
  })

  if (userCode.status === 200) return userCode.data
  else throw userCode.status
}

/**
 * Get the actual term (Ex: 20181)
 * @param {number} userCode User code
 * @param {string} user Username
 * @param {string} pass Password
 */
const getTerm = async (userCode, user, pass) => {
  const calendar = await http(`${CALENDAR}/${userCode}`, {
    method: 'GET',
    auth: {
      username: user,
      password: pass
    }
  })

  if (calendar.status !== 200) {
    throw {
      code: calendar.status,
      msg: 'Error al tratar de obtener semestre',
      json: calendar.statusText
    }
  }

  return calendar.data
}

/**
 * Get all the courses from the actual term
 * @param {number} userCode User code
 * @param {string} user Username
 * @param {string} pass Password
 */
const getCalendar = async (userCode, user, pass) => {
  try {
    const term = await getTerm(userCode, user, pass)

    const subject = await http(`${SUBJECT}/${userCode}?term=${term.terms[0].id}`, {
      method: 'GET',
      auth: {
        username: user,
        password: pass
      }
    })

    if (subject.status !== 200) {
      throw {
        code: subject.status,
        msg: 'Error al tratar de obtener calendario',
        json: subject.statusText
      }
    }

    return subject.data
  } catch (er) {
    throw er
  }

}

module.exports = {
  getUserCode,
  getCalendar
}