/*
This script will use the existing private key to sign a JWT and print to console
*/

const jwt = require('jsonwebtoken')
const fs = require('fs')
// load the private RSA key file
const key = fs.readFileSync('../certs/rsa-private.pem')

require('dotenv').load()

const jwtOptions = {
  algorithm: process.env.jwt_algorithm
  // expiresIn: process.env.jwt_expires_in
}
const passphrase = process.env.jwt_rsa_passphrase

const body = {
  user: 'cvp-app'
}
// sign new JWT token
const token = jwt.sign(body, {key, passphrase}, jwtOptions)
console.log(token)
