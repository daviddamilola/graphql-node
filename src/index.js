const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const resolvers = {
    Query: {
        info: () => 'This is the api of hacker news clone',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany();
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                }
            })
            return newLink
        },
        updateLink: async (parent, args) => {
            const updatedLink = await prisma.link.update({
                where: {
                  id: parseInt(args.id, 10),
                },
                data: {
                    url: args.url,
                    description: args.description,
                },
              })
            return updatedLink
        },
        deleteLink: async (parent, args) => {
            const deletedLink = await prisma.link.delete({
                where: {
                  id: parseInt(args.id, 10),
                }
            })
            return deletedLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
    context: {prisma},
})

server
    .listen()
    .then(({url}) => {
        console.log(`server is running on ${url}`);
    })