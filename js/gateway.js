const grpc = require('/var/lib/app/node_modules/grpc/src/node');

class Gateway {
  constructor(gatewayHost = 'apigateway:80') {
    const user = grpc.load('/var/lib/core/protos/user.proto').user;
    const auth = grpc.load('/var/lib/core/protos/auth.proto').auth;
    const credentials = grpc.credentials.createInsecure();

    this.user = new user.User(gatewayHost, credentials);
    this.auth = new auth.Auth(gatewayHost, credentials);
  }

  request(client, method, data) {
    return new Promise((resolve, reject) => {
      client[method](data, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  createUser(req) {
    const data = {
      email: req.email,
      password: req.password,
      name: req.name
    };

    return this.request(this.user, 'createUser', data);
  }

  getUser(req) {
    const data = {
      id: req.id
    };

    return this.request(this.user, 'getUser', data);
  }

  login(req) {
    const data = {
      email: req.email,
      password: req.password
    };

    return this.request(this.auth, 'login', data);
  }
}

module.exports = Gateway;
