const config = {
   mongo: {
      options: {
         useUnifiedTopology: true,
         useNewUrlParser: true,
         socketTimeoutMS: 30000,
         keepAlive: true,
         autoIndex: false,
         retryWrites: false,
      },
      url: 'mongodb://127.0.0.1:27017/pos-food',
   },
   server: {
      host: `localhost`,
      port: 5000,
   },
}

export default config
