# Как поднять сервер локально
Предварительно нужно  [настроить окружение](https://github.com/megatolya/achivki/blob/master/README.md) и [включить БД](https://github.com/megatolya/achivki/blob/master/database/README.md).

Запуск
```shell
node server
```

Не проверять токены
```shell
node server --no-token
```

Для подхватывания изменений без перезагрузки сервера:
```shell
# установка супервизора
npm install -g supervisor
# запуск сервера
supervisor server
```

Не проверять токены
```shell
supervisor -- server --no-token
```
