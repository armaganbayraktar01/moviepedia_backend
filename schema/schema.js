const graphql = require('graphql');
const _ = require('lodash');

const MovieSchema = require('../models/MovieSchema');
const PersonSchema = require('../models/PersonSchema');

const { 
    GraphQLSchema, GraphQLObjectType, GraphQLString, 
    GraphQLInt, GraphQLID, GraphQLList, GraphQLNonNull
} = graphql;


const MovieType = new GraphQLObjectType({
   name: 'Movie',
   fields: () => (
    {
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        titleTr: { type: new GraphQLNonNull(GraphQLString) },
        synopsis: { type: new GraphQLNonNull(GraphQLString) }, 
        imbd_id:  { type: new GraphQLNonNull(GraphQLString) },
        imbd_rating: { type: new GraphQLNonNull(GraphQLString) },
        relase_year: { type: new GraphQLNonNull(GraphQLInt) },
        genres: { type: new GraphQLNonNull(GraphQLString) },
        duration:  { type: new GraphQLNonNull(GraphQLInt) },
        director: { 
            type: new GraphQLNonNull(PersonType),
            resolve(parent, args){
              //return _.find(persons, {id: parent.director }) //parent root da dönen resolve değeridir yani burada movies
              return PersonSchema.findById(parent.director);
           }
        },
        cast: { 
            type: new GraphQLList(new GraphQLNonNull(PersonType)),
            resolve(parent, args){
              //return _.find(persons, {id: parent.director }) //parent root da dönen resolve değeridir yani burada movies
              return PersonSchema.find(parent.cast);
           }
        },
        cover: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: GraphQLString }
   })
});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: { type: GraphQLID },
        fullname: { type: new GraphQLNonNull(GraphQLString) },
        bio: { type: new GraphQLNonNull(GraphQLString) }, 
        imbd_id:  { type: new GraphQLNonNull(GraphQLString) },
        imbd_rating: { type: new GraphQLNonNull(GraphQLInt) },
        birth: { type: new GraphQLNonNull(GraphQLInt) },
        cover: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: GraphQLString },
        filmography: { 
            type: new GraphQLList(MovieType),
            resolve(parent, args){
              //return _.filter(movies, {director: parent.id })
              return MovieSchema.find({ director: parent.id });             
           }
        },
    })
 });

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                //return _.find(movies, {id: args.id })
                return MovieSchema.findById(args.id);  
            }
        },
        person: {
            type: PersonType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                //return _.find(persons, {id: args.id })
                return PersonSchema.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args){
                //return _.find(movies, {id: args.id })
                return MovieSchema.find({});  
            }
        },
        persons: {
            type: new GraphQLList(PersonType),
            resolve(parent, args){
                //return _.find(persons, {id: args.id })
                return PersonSchema.find({});;
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:  {
        addMovie: {
            type: MovieType,
            args: {
                title: { type: GraphQLString },
                titleTr: { type: GraphQLString },
                synopsis: { type: GraphQLString }, 
                imbd_id:  { type: GraphQLString },
                imbd_rating: { type: GraphQLString },
                relase_year: { type: GraphQLInt },
                genres: { type: GraphQLString },
                duration:  { type: GraphQLInt },
                director: { type: GraphQLString },
                cover: { type: GraphQLString },
                createdAt: { type: GraphQLString }
            },
            resolve(parent, args){
                const movie = new MovieSchema({
                    title: args.title,
                    titleTr: args.titleTr,
                    synopsis: args.synopsis,
                    imbd_id:  args.imbd_id,
                    imbd_rating: args.imbd_rating,
                    relase_year: args.relase_year,
                    genres: args.genres,
                    duration:  args.duration,
                    director: args.director,
                    cover: args.cover,
                    createdAt: args.createdAt
                });
                
                return movie.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
