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
      url: 'mongodb://localhost/pos-food',
   },
   server: {
      host: `localhost`,
      port: 5000,
   },
}

export default config
