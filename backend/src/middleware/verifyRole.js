// @ts-check

/**
 * @typedef {'guest'|'member'|'admin'} UserRole
 */

/**
 * @param {Array<UserRole>} userRoles
 */
module.exports = (userRoles) => (req, res, next) => {
  const userRole = !req.session.user ? 'guest' : req.session.user.role

  if (!userRoles.some(role => role === userRole)) {
    return res.status(403).end()
  }

  next()
}
