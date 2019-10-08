// @ts-check
/* eslint-env jest */

const { DbHelper } = require('../utils/TestHelper')
const dbHelper = new DbHelper()

beforeAll(async () => {
  await dbHelper.start()
})

afterAll(async () => {
  await dbHelper.stop()
})

const supertest = require('supertest')
const { User } = require('../src/models')
const { validatePassword } = require('../src/services/crypto')
const app = require('../src/app')

const mailerService = require('../src/services/mailer')
jest.mock('../src/services/mailer')
const { generateToken } = jest.requireActual('../src/services/mailer')

const request = supertest(app)

const REGISTER_URL = '/api/register'
const LOGIN_URL = '/api/login'
const LOGOUT_URL = '/api/logout'
const EMAIL_VERIFY_URL = '/api/user/verify'
const SEND_RESET_URL = '/api/user/sendReset'
const RESET_PASSWORD_URL = '/api/user/resetPassword'
const USER_URL = '/api/user'

function randomString () {
  return Math.random().toString(36).substring(2, 15)
}

function getRandomUserInfo () {
  return {
    username: randomString(),
    password: randomString(),
    email: randomString() + '@mail.invalid'
  }
}

async function registerRandomUser (verified = true) {
  const user = getRandomUserInfo()

  await request.post(REGISTER_URL).send({
    username: user.username,
    email: user.email,
    password: user.password
  })

  if (verified) {
    await User.findOneAndUpdate({
      username: user.username
    }, {
      isVerified: true
    }).lean().exec()
  }

  return user
}

async function getRequestAsUser () {
  const agent = supertest.agent(app)
  const user = await registerRandomUser()

  await agent.post(LOGIN_URL).send({
    username: user.username,
    password: user.password
  })

  return {
    request: agent,
    user
  }
}

describe('Register', () => {
  test('Do not register with incomplete request', async () => {
    const response = await request.post('/api/register').send({
      username: undefined,
      email: 'test@test.pl',
      password: 'test'
    })

    expect(response.status).toBe(400)
  })

  test('Do not register with invalid email', async () => {
    const response = await request.post(REGISTER_URL).send({
      username: 'test',
      email: 'test@testpl',
      password: 'test'
    })

    expect(response.status).toBe(400)
  })

  test('Create new user account', async () => {
    const { username, email, password } = getRandomUserInfo()

    const response = await request.post(REGISTER_URL).send({
      username,
      email,
      password
    })

    expect(response.status).toBe(200)

    const user = await User.findOne({
      username
    }).lean().exec()

    expect(user).toMatchObject({
      username,
      email
    })

    expect(mailerService.sendVerificationEmail).toHaveBeenCalledTimes(1)
    expect(user.password).not.toBe(password)
  })

  test('Do not register duplicates', async () => {
    const { username, email, password } = await registerRandomUser()

    const response = await request.post(REGISTER_URL).send({
      username,
      email,
      password
    })

    expect(response.status).toBe(409)

    const user = await User.find({
      username
    }).lean().exec()

    expect(user.length).toBe(1)
  })
})

describe('Verify email', () => {
  test('Verify email with correct token', async () => {
    const { username, email } = await registerRandomUser(false)
    const token = await generateToken('verify', email)
    const response = await request.get(EMAIL_VERIFY_URL + '/' + token)

    expect(response.status).toBe(302)

    const user = await User.findOne({
      username
    }).lean().exec()

    expect(user.isVerified).toBe(true)
  })

  test('Do not verify with incorrect token', async () => {
    const { username } = await registerRandomUser(false)
    const token = 'invalidtoken'
    const response = await request.get(EMAIL_VERIFY_URL + '/' + token)

    expect(response.status).toBe(400)

    const user = await User.findOne({
      username
    }).lean().exec()

    expect(user.isVerified).toBe(false)
  })

  test('Do not verify non-existent email', async () => {
    const email = 'nonexistent@email.invalid'
    const token = await generateToken('verify', email)
    const response = await request.get(EMAIL_VERIFY_URL + '/' + token)

    expect(response.status).toBe(400)

    const user = await User.findOne({
      email
    }).lean().exec()

    expect(user).toBeNull()
  })
})

describe('Login', () => {
  test('Do not login with incomplete request', async () => {
    const response = await request.post(LOGIN_URL).send({
      username: undefined,
      password: 'test'
    })

    expect(response.status).toBe(400)
    expect(response.header['set-cookie']).toBeUndefined()
  })

  test('Do not login to non-existent account', async () => {
    const response = await request.post(LOGIN_URL).send({
      username: 'wrong',
      password: 'wrong'
    })

    expect(response.status).toBe(400)
    expect(response.header['set-cookie']).toBeUndefined()
  })

  test('Do not login with wrong password', async () => {
    const { username } = await registerRandomUser()

    const response = await request.post(LOGIN_URL).send({
      username,
      password: 'wrong'
    })

    expect(response.status).toBe(400)
    expect(response.header['set-cookie']).toBeUndefined()
  })

  test('Do not login with unverified email', async () => {
    const { username, password } = await registerRandomUser(false)

    const response = await request.post(LOGIN_URL).send({
      username,
      password
    })

    expect(response.status).toBe(400)
    expect(response.header['set-cookie']).toBeUndefined()
  })

  test('Login user', async () => {
    const { username, password } = await registerRandomUser()

    const response = await request.post(LOGIN_URL).send({
      username,
      password
    })

    expect(response.status).toBe(200)
    expect(response.header['set-cookie']).toBeDefined()
  })

  test('Allow login without logging out', async () => {
    const { request, user } = await getRequestAsUser()

    const response = await request.post(LOGIN_URL).send({
      username: user.username,
      password: user.password
    })

    expect(response.status).toBe(200)
  })
})

describe('Logout', () => {
  test('Return 200', async () => {
    const response = await request.post(LOGOUT_URL)

    expect(response.status).toBe(200)
  })
})

describe('Reset password', () => {
  describe('Send reset email', () => {
    test('Reject incomplete request', async () => {
      const response = await request.post(SEND_RESET_URL).send({
        email: undefined
      })

      expect(response.status).toBe(400)
      expect(mailerService.sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    test('Do not send to non-existent email', async () => {
      const response = await request.post(SEND_RESET_URL).send({
        email: 'some@email.invalid'
      })

      expect(response.status).toBe(200)
      expect(mailerService.sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    test('Do not send to verified email', async () => {
      const { email } = await registerRandomUser()

      const response = await request.post(SEND_RESET_URL).send({ email })

      expect(response.status).toBe(200)
      expect(mailerService.sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    test('Send to vaild email', async () => {
      const { username, email } = await registerRandomUser(false)

      const response = await request.post(SEND_RESET_URL).send({ email })

      expect(response.status).toBe(200)
      expect(mailerService.sendPasswordResetEmail).toHaveBeenCalledWith(username, email)
    })
  })

  describe('Reset password using reset token', () => {
    test('Reject incomplete request', async () => {
      const response = await request.post(RESET_PASSWORD_URL).send({
        token: undefined,
        password: 'newpass'
      })

      expect(response.status).toBe(400)
    })

    test('Do not reset with invalid token', async () => {
      const response = await request.post(RESET_PASSWORD_URL).send({
        token: 'invalid',
        password: 'newpass'
      })

      expect(response.status).toBe(400)
    })

    test('Do not reset with incorrect token', async () => {
      const email = 'test@email.invalid'
      const token = await generateToken('verify', email)

      const response = await request.post(RESET_PASSWORD_URL).send({
        token,
        password: 'newpass'
      })

      expect(response.status).toBe(400)
    })

    test('Reject reseting non-existent accounts', async () => {
      const email = 'nonexistent@email.invalid'
      const token = await generateToken('reset', email)

      const response = await request.post(RESET_PASSWORD_URL).send({
        token,
        password: 'newpass'
      })

      expect(response.status).toBe(400)
    })

    test('Reset with correct token', async () => {
      const { email } = await registerRandomUser()
      const token = await generateToken('reset', email)
      const newPassword = 'newpass'

      const response = await request.post(RESET_PASSWORD_URL).send({
        token,
        password: newPassword
      })

      expect(response.status).toBe(200)

      const user = await User.findOne({ email }).lean().exec()

      expect(await validatePassword(newPassword, user.password)).toBe(true)
    })
  })
})

describe('User', () => {
  describe('Get user', () => {
    test('Do not return if not logged in', async () => {
      const response = await request.get(USER_URL)

      expect(response.status).toBe(401)
    })

    test('Return user if logged in', async () => {
      const { request, user } = await getRequestAsUser()

      const response = await request.get(USER_URL)

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        username: user.username,
        role: 'member'
      })
    })
  })

  describe('Update user', () => {
    test('Reject on duplicate', async () => {
      const { request, user } = await getRequestAsUser()
      const userDuplicate = await registerRandomUser()

      const usernameResponse = await request.patch(USER_URL).send({
        username: userDuplicate.username
      })

      expect(usernameResponse.status).toBe(400)

      const emailResponse = await request.patch(USER_URL).send({
        email: userDuplicate.email,
        currentPassword: user.password
      })

      expect(emailResponse.status).toBe(400)
    })

    test('Reject on invalid password', async () => {
      const { request, user } = await getRequestAsUser()
      const newEmail = 'new@email.invalid'

      const response = await request.patch(USER_URL).send({
        email: newEmail,
        currentPassword: 'wrong'
      })

      expect(response.status).toBe(401)

      const userModel = await User.findOne({ username: user.username }).lean().exec()

      expect(userModel.email).toBe(user.email)
      expect(userModel.isVerified).toBe(true)
      expect(mailerService.sendVerificationEmail).not.toHaveBeenCalledWith(user.username, newEmail)
    })

    test('Update username', async () => {
      const { request, user } = await getRequestAsUser()
      const newUsername = 'new'

      const response = await request.patch(USER_URL).send({
        username: newUsername
      })

      expect(response.status).toBe(200)

      const userModel = await User.findOne({ email: user.email }).lean().exec()

      expect(userModel.username).toBe(newUsername)
    })

    test('Update email', async () => {
      const { request, user } = await getRequestAsUser()
      const newEmail = 'new@email.invalid'

      const response = await request.patch(USER_URL).send({
        email: newEmail,
        currentPassword: user.password
      })

      expect(response.status).toBe(200)

      const userModel = await User.findOne({ username: user.username }).lean().exec()

      expect(userModel.email).toBe(newEmail)
      expect(userModel.isVerified).toBe(false)
      expect(mailerService.sendVerificationEmail).toHaveBeenCalledWith(user.username, newEmail)
    })

    test('Update password', async () => {
      const { request, user } = await getRequestAsUser()
      const newPassword = 'newpass'

      const response = await request.patch(USER_URL).send({
        password: newPassword,
        currentPassword: user.password
      })

      expect(response.status).toBe(200)

      const userModel = await User.findOne({ username: user.username }).lean().exec()

      expect(await validatePassword(newPassword, userModel.password)).toBe(true)
    })
  })
})
