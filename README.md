# Popcorn
Wonder what movie to watch next with your friends and family? Use Popcorn to fetch movie recommendations!

## Database
### Local Development
Step one, enter `psql` command line interface:
```
psql postgres
```

Check what the users you have in your local Postgres server:
```
\du
```

If it does not have the user you want, create one:
```
create user cto superuser createdb createrole;
```

Give your new user a password:
```
alter user cto with password 'cto';
```

Now you can go ahead and create a database with owner pointing to a user:
```
create database popcorn_development with owner=cto;
```


