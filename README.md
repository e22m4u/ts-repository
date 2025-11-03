## @e22m4u/ts-repository

Модуль предоставляет расширенную версию класса `DatabaseSchema` из пакета
[@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository)
для работы в TypeScript окружении. Он добавляет методы, которые позволяют определять модели данных и получать репозитории, используя TypeScript классы
вместо объектов с определениями.

Модуль реэкспортирует все сущности из указанных ниже пакетов:

- [@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository) - реализация паттерна «Репозиторий» для баз данных;
- [@e22m4u/js-repository-decorators](https://www.npmjs.com/package/@e22m4u/js-repository) - декораторы для описания моделей;

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

## Пример

1\. Объявление источника данных и моделей с помощью декораторов.

```ts
import {
  model,
  property,
  relation,
  DataType,
  RelationType
  DatabaseSchema,
} from '@e22m4u/ts-repository';

// создание экземпляра схемы
const dbs = new DatabaseSchema();

// объявление источника данных
dbs.defineDatasource({
  name: 'myDb',
  adapter: 'memory',
});

// модель Role
@model({datasource: 'myDb'})
class Role {
  @property({
    type: DataType.NUMBER,
    primaryKey: true,
  })
  id!: number;
  
  @property(DataType.STRING)
  name?: string;
}

// модель User
@model({datasource: 'myDb'})
class User {
  @property({
    type: DataType.NUMBER,
    primaryKey: true,
  })
  id!: number;

  @property(DataType.STRING)
  name?: string;

  @property(DataType.NUMBER)
  roleId?: number;

  @relation({
    type: RelationType.BELONGS_TO,
    model: Role.name,
  })
  role?: Role;
}
```

2\. Регистрация моделей и работа с репозиторием.

```ts
// регистрация моделей по классам
dbs.defineModelByClass(Role);
dbs.defineModelByClass(User);

// получение типизированных репозиториев
const roleRep = dbs.getRepositoryByModelClass(Role);
const userRep = dbs.getRepositoryByModelClass(User);

// создание документов
const role = await roleRep.create({name: 'Admin'});
const user = await userRep.create({name: 'John', roleId: role.id});

// поиск документа с разрешением связи
const userWithRole = await userRep.findById(user.id, {
  include: 'role',
});

console.log(userWithRole);
// {
//   id: 1,
//   name: 'John',
//   roleId: 1,
//   role: {id: 1, name: 'Admin'}
// }
```

## Расширение DatabaseSchema

Класс `DatabaseSchema` данного пакета наследует все методы базового класса
и добавляет два новых для работы с классами моделей.

#### defineModelByClass

Извлекает определение модели из класса, декорированного `@model`,
и регистрирует его в схеме.

```ts
import {model, DatabaseSchema} from '@e22m4u/ts-repository';

@model({datasource: 'myDb'})
class MyModel {}

const dbs = new DatabaseSchema();
dbs.defineDatasource({name: 'myDb', adapter: 'memory'});

dbs.defineModelByClass(MyModel);
```

#### getRepositoryByModelClass

Возвращает типизированный экземпляр `Repository` для указанного класса модели.

```ts
import {
  model,
  Repository,
  DatabaseSchema,
} from '@e22m4u/js-repository';

@model({datasource: 'myDb'})
class MyModel {
  id!: string;
}

const dbs = new DatabaseSchema();
dbs.defineDatasource({name: 'myDb', adapter: 'memory'});
dbs.defineModelByClass(MyModel);

const repository = dbs.getRepositoryByModelClass(MyModel);
// Repository<MyModel>
```

## Декораторы

Модуль реэкспортирует все декораторы из пакета
[@e22m4u/js-repository-decorators](https://www.npmjs.com/package/@e22m4u/js-repository-decorators).

- `@model` - объявление модели;
- `@property` - объявление свойства;
- `@relation` - объявление связи;

Подробное описание каждого декоратора и его опций доступно в
[документации](https://www.npmjs.com/package/@e22m4u/js-repository-decorators) связанного модуля.


## Тесты

```bash
npm run test
```

## Лицензия

MIT