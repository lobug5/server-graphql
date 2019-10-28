
const {GraphQLServer} = require('graphql-yoga');
const data = require('./data');

// Definição dos tipos no schema
const typeDefs = `
  type Channel{
    idChannel: Int,
    name: String,
    playlists: [Playlist],
  }

  type Playlist{
    idPlaylist: Int,
    name: String
    videos: [Video]
  }

  type Video{
    idVideo: Int,
    title: String
  }

  type ChannelField{
    idChannel: Int,
    name: String
  }


  type Query{
    channels: [Channel],
  
    channel(idChannel: Int): [Channel]
  }

  type Mutation{
    setChannel(idChannel: Int, name: String): Channel
  }
`;
// Definição do Array de posts utilizado na Mutation
const posts = []

// Definição dos resolvers que é a parte lógica do schema
const resolvers = {
  Query: {
    // Retorna todas as informações dos canais cadastrados no data.js
    channels(){
      return data.getData('channels');
    },

    channel(obj, args){
      return data.getData('channels', 'idChannel', args.idChannel);
    }

  },
  Channel: {
    playlists: function(obj, args){
      return data.getData('playlists', 'idChannel', obj.idChannel);
    }
  },
  Playlist:{
    videos: function(obj, args){
      return data.getData('videos', 'idPlaylist', obj.idPlaylist);
    }
  },
  Mutation:{
    setChannel: function(obj, args){
       const post = {
        idChannel: args.idChannel,
        name: args.name
      }
      posts.push(post)
      return post
    }
  }
};

const server = new GraphQLServer({typeDefs, resolvers})
server.start();