const { ApolloServer } = require('apollo-server')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
require('dotenv').config()

const astraToken = process.env.REACT_APP_ASTRA_TOKEN

class StargateGraphQLDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        request.http.headers.set('x-cassandra-token',astraToken)
    }
}

const gateway = new ApolloGateway({
    serviceList: [
        {
            name: 'coins',
            url: 'https://d999e482-8b71-4a58-9f74-f38edcc8e5ef-southcentralus.apps.astra.datastax.com/api/graphql/coins'
        },
        {
            name:'deals',
            url: ''
        }
    ],

    introspectionHeaders: {
        'x-cassandra-token': astraToken
    },

    buildService({name, url}){
        if(name == 'coins') {
            return new StargateGraphQLDataSource({url})
        } else {
            return new RemoteGraphQLDataSource
        }
    },
    __exposeQueryPlanExperimental: true
})
//federates Coins and deals

;(async () => {
    const server = new ApolloServer({
        gateway,
        engine: false,
        subscriptions:false
    })
} ) 
//starts apollo server

server.listen().then(({ url }) => {
    console.log(`Gateway ready at ${url}`)
})