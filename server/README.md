# Как поднять сервер локально
Установка
```shell
npm install
```
Запуск:
Предварительно нужно [включить БД](https://github.com/megatolya/achivki/blob/master/database/README.md). Затем:
```shell
node server/
```

Не проверять токены
```shell
node server/ --no-token
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
