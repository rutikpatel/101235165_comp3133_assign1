const express = require('express');
const mongoose = require('mongoose');
const TypeDefs = require('./schema')
const Resolvers = require('./resolvers.js')
const cors = require('cors');


const { ApolloServer } = require('apollo-server-express')

const dotenv = require('dotenv');
dotenv.config();

const PORT = 4000
const MONGODB_URL = "mongodb://localhost:27017/assignment1"
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Connected MongoDB connection.')
}).catch(err => {
  console.log('Failed to connect to database...')
});

const server = new ApolloServer({
  debug:false,
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers
  
})

const app = express();
app.use(express.json());
app.use('*', cors());

server.start().then(res => {
  server.applyMiddleware({
    app,
    cors: false
  })
  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`))
});