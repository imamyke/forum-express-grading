const path = require('path')
const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers') // 解構賦值的用法
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const helpers = require('handlebars-helpers')
const multihelpers = helpers()
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers, multihelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req) // equal to req.user
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}`)
})

module.exports = app
