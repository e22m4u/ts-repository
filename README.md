## @e22m4u/ts-repository

Реализация репозитория для работы с базами данных с поддержкой TypeScript
классов в качестве моделей. Модуль расширяет класс `DatabaseSchema` из пакета
[@e22m4u/js-repository](https://github.com/e22m4u/js-repository) методами
для определения моделей используя TypeScript классы.

Декораторы [@e22m4u/js-repository-decorators](https://github.com/e22m4u/js-repository-decorators)

## Установка

```bash
npm install @e22m4u/ts-repository
```

#### Поддержка декораторов

Для включения поддержки декораторов, добавьте указанные ниже опции
в файл `tsconfig.json` вашего проекта.

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

## Использование

Создание экземпляра схемы базы данных.

```ts
import {DatabaseSchema} from '@e22m4u/ts-repository';

const dbs = new DatabaseSchema();
```

Определение источников показано на примере
[MongoDB адаптера](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter).

```ts
dbs.defineDatasource({
  name: 'myMongo', // название источника
  adapter: 'mongodb', // имя адаптера
  // параметры
  host: '127.0.0.1',
  port: 27017,
  database: 'myDatabase',
});
```

Объявление модели (см. [Декораторы](https://www.npmjs.com/package/@e22m4u/js-repository-decorators)).

```ts
import {model} from '@e22m4u/ts-repository';
import {property} from '@e22m4u/ts-repository';
import {DataType} from '@e22m4u/ts-repository';

@model({datasource: 'myMongo'})
class User {
  @property({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @property({
    type: DataType.STRING,
    required: true,
  })
  name!: string;
  
  @property(DataType.NUMBER)
  age!: number;
}

// регистрация модели
dbs.defineModelByClass(User)
```

Работа с репозиторием (см. [Репозиторий](https://www.npmjs.com/package/@e22m4u/js-repository#%D1%80%D0%B5%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80%D0%B8%D0%B9)).

```ts
// получение репозитория для User
const userRep = dbs.getRepositoryByModelClass(User);

// добавление в коллекцию User нового документа
let user = await userRep.create({
  name: 'John Doe',
  age: '24'
});
console.log(user);
// {
//   id: '686133c3ba947189b202a827',
//   name: 'John Doe',
//   age: 24
// }

// обновление документа User по идентификатору
user = await userRep.patchById(user.id, {
  name: 'John Smith',
});
console.log(user);
// {
//   id: '686133c3ba947189b202a827',
//   name: 'John Smith',
//   age: 24
// }

// удаление документа User по идентификатору
const count = await userRep.deleteById(user.id);
console.log(count); // 1
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
