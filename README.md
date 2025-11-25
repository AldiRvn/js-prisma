# js-prisma

## CLI

- `npm init -y`
- `npm i express nodemon`
- `npm install prisma --save-dev`
- `npx prisma init`
- Start MySQL

```bash
docker rm -f mysql;
docker run \
    --name mysql \
    -p 3300:3306 \
    -e MYSQL_ROOT_PASSWORD=password \
    -d mysql:latest
```

- `npx prisma migrate dev`
