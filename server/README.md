# Как поднять сервер локально
## База данных
Нужно установить mongodb. Настройка не нужна, достаточно запусть бд на дефолтном порту.
```shell
# находясь в корне проекта
# установка бд
brew install mongodb
# папка для бд
mkdir db
# запуск
mongod --dbpath db
```
Проверить работоспособность бд можно в отдельном процессе:
```shell
mongo
>show dbs
```

Наполнение базы
```shell
# при запущенном mongod
grunt init-database
```

## Сервер
Установка
```shell
# находясь в папке server/
npm install
```
Запуск:
```shell
# находясь в папке server/
node index.js
```

Не проверять токены
```shell
node index.js --no-token
```

Для подхватывания изменений без перезагрузки сервера:
```shell
# установка супервизора
npm install -g supervisor
# запуск сервера
supervisor index.js
```

Не проверять токены
```shell
supervisor -- server --no-token
```
