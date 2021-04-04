const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]

let idCount = links.length
const resolvers = {
    Query: {
        info: () => 'This is the api of hacker news clone',
        feed: () => links,
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link);
            return link
        },
        updateLink: (parent, args) => {
            const staleLinkIndex= links.findIndex(each => each.id == args.id);
            const staleLink = links[staleLinkIndex]
            const updatedLink = {
                id: staleLink.id,
                description: args.description,
                url: args.url,
            }
            links[staleLinkIndex] = updatedLink;
            return updatedLink
        },
        deleteLink: (parent, args) => {
            const staleLinkIndex= links.findIndex(each => each.id == args.id);
            const staleLink = links[staleLinkIndex]
            links.splice(staleLinkIndex, 1);
            return staleLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
})

server
    .listen()
    .then(({url}) => {
        console.log(`server is running on ${url}`);
    })