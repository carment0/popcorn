# Popcorn
Wonder what movie to watch next with your friends and family? Use Popcorn to fetch movie recommendations!

## Local Development Setup
### Dependency
The default choice of Go is 1.9.3 for this project and we are using `dep` to perform package dependency management. For
frontend, we are using `npm` for JavaScript dependency management. Thus, you need the following:

* Go 1.9.3
* PostgreSQL 9.3
* Node 6.10
* npm 3.10
* dep latest

### Database
Step one, enter `psql` command line interface:
```
psql postgres
```

Check what the users you have in your local Postgres server:
```
\du
```

Create a user named `popcorn`
```
create user popcorn superuser createdb createrole;
```

Give your `popcorn` a password:
```
alter user popcorn with password 'popcorn';
```

Now you can go ahead and create a database with owner pointing to `popcorn`:
```
create database popcorn_development with owner=popcorn;
```

Quit `psql`:
```
\q
```

## Build Project
### Backend
Inside your popcorn directory, Run `go install` to build the binary for your server
``` 
go install
```

Run `go install` to build the binaries for other commands 
```
go install ./cmd/...
```

To start the server, simply run
```
popcorn
```

To seed the database, simply run
```
seed
```

Check if your seeds are actually working
```
psql popcorn_development
```

Enter the following SQL command:
```
select title from movies;
```

### Frontend
Install all the required node modules
```
npm install
```

And then build your scripts and style sheets
```
npm run build:watch
```

