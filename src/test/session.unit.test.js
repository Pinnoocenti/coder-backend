import mongoose from 'mongoose'
import * as chai from 'chai'
import userDAO from '../dao/Manager/userDAO.js'
import { Command } from 'commander'
import { getVariables } from '../config/config.js'

const program = new Command()
const options = program.parse()
const {mongo_URL_test} = getVariables(options)
mongoose.connect(mongo_URL_test)

const expect = chai.expect