require('dotenv').config()

const fs = require('fs')
const path = require('path')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { Engine } = require('node-uci')

const getRoot = require('./root')

async function main() {
  const app = express()

  const schema = buildSchema(
    fs.readFileSync(
      path.join(__dirname, 'schema.graphql')
    ).toString()
  )

  const engine = new Engine(
    path.join(__dirname, '../bin', process.env.ENGINE)
  )

  await engine.init()

  const routeHandler = graphqlHTTP({
    rootValue: getRoot(engine),
    graphiql: process.env.GRAPHIQL,
    schema
  })

  app.use('/', routeHandler)
  app.listen(process.env.PORT)
}

module.exports = main

if (require.main) module.exports();
