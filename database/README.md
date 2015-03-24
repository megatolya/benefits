# База данных

#### Установка
[См. офф. сайт](http://docs.mongodb.org/manual/installation/)

#### Запуск/Перезапуск
```shell
grunt db:start
grunt db:restart # алиас для db:start
```

Запустить чистую бд с предзаполненными данными:
```shell
grunt db:start --fresh
```

Выключение:
```shell
grunt db:stop
```
