# WatchMe

## Frontend

## Backend
The backend is written in Go and uses the package [fiber](https://github.com/gofiber/fiber) for the backend framework.

### Setup

To set up the backend, follow these steps:

1. Clone the repository.
 ```bash
 git clone https://github.com/Waxer59/WatchMe.git
 ```
2. Change the working directory to the backend directory.
 ```bash
 cd WatchMe/backend
 ```
3. Install the dependencies.
 ```bash
 go mod download
 ```
4. Clone `.template.env` to `.env` and fill in the required environment variables.
 ```bash
 cp .template.env .env
 ```
* The `OAUTH_GITHUB_REDIRECT_URL`, `OAUTH_GITHUB_CLIENT_ID`, and `OAUTH_GITHUB_CLIENT_SECRET` are the OAuth2 credentials for your Github application.
* The `DB_PASSWORD`, `DB_PORT`, `DB_HOST`, `DB_NAME`, and `DB_USERNAME` are the database connection details.
* The `COOKIE_ENCRYPTION_KEY` is a random string used to encrypt the cookies.
* The `JWT_SECRET_KEY` is a random string used to sign the JWT tokens.
* The `PORT` is the port the backend will listen on.
* The `FRONTEND_URL` is the URL of the frontend.
> [!TIP]
> To generate a random string, you can use the command `openssl rand -base64 32`.
5. Run the backend.
 ```bash
 go run main.go
 
 # or for hot reloading

 air
 ```

### Dependencies
The backend uses the following dependencies:

- [fiber](https://github.com/gofiber/fiber)
- [fiber/swagger](https://github.com/gofiber/swagger)
- [fiber/encryptcookie](https://github.com/gofiber/encryptcookie)
- [fiber/helmet](https://github.com/gofiber/helmet)
- [fiber/cors](https://github.com/gofiber/cors)
- [fiber/logger](https://github.com/gofiber/logger)
- [gorm](https://github.com/go-gorm/gorm)
- [gorm/postgres](https://github.com/go-gorm/postgres)
- [air](https://github.com/air-verse/air)

### Swagger

This project uses the package [swag](https://github.com/gofiber/swagger) to generate API documentation.

To generate the documentation, run the following command:

```bash
swag init
```

This will generate the documentation in the `docs` directory.

To format the documentation, run the following command:

```bash
swag fmt
```

