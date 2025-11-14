## @e22m4u/ts-repository

Модуль предоставляет расширенную версию класса `DatabaseSchema` из пакета
[@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository),
добавляя методы и TypeScript декораторы, которые позволяют описывать модели
данных используя классы вместо объектов определений.

Модуль реэкспортирует все сущности из JavaScript версии
[основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository),
исключая необходимость установки дополнительных зависимостей.

## Оглавление

- [Установка](#установка)
- [Пример](#пример)
- [Расширение DatabaseSchema](#расширение-databaseschema)
  - [defineModelByClass](#definemodelbyclass)
  - [getRepositoryByModelClass](#getrepositorybymodelclass)
- [Декораторы](#декораторы)
  - [@model](#modeloptions-modeloptions)
  - [@property](#propertymetadata-propertymetadata)
  - [@relation](#relationmetadata-relationmetadata)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

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
*(см. раздел «Источник данных» [основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository#%D0%B8%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D0%BA-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85))*

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

2\. Регистрация моделей и доступ к их репозиториям.  
*(см. раздел «Репозиторий» [основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository#%D1%80%D0%B5%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80%D0%B8%D0%B9))*

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

Класс `DatabaseSchema` данного модуля наследует все методы базового класса
и добавляет два новых для работы с классами моделей. Подробнее о базовом классе
можно ознакомиться в раздел «Схема»
[основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository#%D1%81%D1%85%D0%B5%D0%BC%D0%B0).

### defineModelByClass

Извлекает определение модели из класса, декорированного `@model`,
и регистрирует его в схеме.

Сигнатура:

```ts
/**
 * Зарегистрировать модель по классу.
 *
 * @param ctor
 */
defineModelByClass<T extends object>(ctor: Constructor<T>): this;
```

Пример:

```ts
import {model, DatabaseSchema} from '@e22m4u/ts-repository';

@model({datasource: 'myDb'})
class MyModel {}

const dbs = new DatabaseSchema();
dbs.defineDatasource({name: 'myDb', adapter: 'memory'});
dbs.defineModelByClass(MyModel);
```

### getRepositoryByModelClass

Возвращает типизированный экземпляр `Repository` для указанного класса модели.

Сигнатура:

```ts
/**
 * Получить репозиторий по классу модели.
 *
 * @param ctor
 */
getRepositoryByModelClass<T extends object>(
  ctor: Constructor<T>,
): Repository<T>;
```

Пример:

```ts
import {
  model,
  Repository,
  DatabaseSchema,
} from '@e22m4u/ts-repository';

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

- [@model](#modeloptions-modeloptions) - объявление модели
- [@property](#propertymetadata-propertymetadata) - объявление свойства
- [@relation](#relationmetadata-relationmetadata) - объявление связи

### @model(options?: ModelOptions)

Декоратор применяется к классу и назначает его моделью определенной
коллекции/таблицы в базе данных или встраиваемой частью других моделей.

```ts
import {model} from '@e22m4u/ts-repository';

@model() // <=
class User {}
```

Опции (свойства объекта `ModelOptions`).

- [datasource](#ModelOptionsdatasource) - название источника данных;
- [tableName](#ModelOptionstableName) - названия таблицы в базе данных;

#### ModelOptions.datasource

Определение [источника данных](https://www.npmjs.com/package/@e22m4u/js-repository#%D0%B8%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D0%BA-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85).

```ts
import {model} from '@e22m4u/ts-repository';

@model({datasource: 'mongo'}) // <=
class User {}
```

#### ModelOptions.tableName

Определение названия коллекции/таблицы в базе данных.  
*(по умолчанию используется имя класса)*

```ts
import {model} from '@e22m4u/ts-repository';

@model({tableName: 'users'}) // <=
class User {}
```

### @property(metadata: PropertyMetadata)

Декоратор применяется к свойству экземпляра класса, определяя
тип допустимого значения.

- `DataType.ANY` - разрешено любое значение;
- `DataType.STRING` - только значение типа `string`;
- `DataType.NUMBER` - только значение типа `number`;
- `DataType.BOOLEAN` - только значение типа `boolean`;
- `DataType.ARRAY` - только значение типа `array`;
- `DataType.OBJECT` - только значение типа `object`;

Пример:

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property(DataType.STRING)
  name?: string;
}
```

Кроме типа данных, первый аргумент декоратора может принимать
объект `PropertyDefinition` со следующими свойствами.

- [type](#PropertyDefinitiontype) - тип допустимых значений;
- [itemType](#PropertyDefinitionitemType) - тип элемента (для массива);
- [model](#PropertyDefinitionmodel) - название модели (для объекта);
- [primaryKey](#PropertyDefinitionprimaryKey) - первичный ключ;
- [columnName](#PropertyDefinitioncolumnName) - название колонки в базе данных;
- [required](#PropertyDefinitionrequired) - исключение `null` и `undefined`;
- [default](#PropertyDefinitiondefault) - значение по умолчанию;
- [validate](#PropertyDefinitionvalidate) - проверка формата;
- [transform](#PropertyDefinitiontransform) - модификаторы значения;
- [unique](#PropertyDefinitionunique) - проверка уникальности;

#### PropertyDefinition.type

Тип передается первым аргументом или внутри объекта опций.

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({type: DataType.STRING}) // <=
  surname?: string;
}
```

#### PropertyDefinition.itemType

Определение типа для элемента массива.

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class Article {
  @property({
    type: DataType.ARRAY,
    itemType: DataType.STRING, // <=
  })
  tags?: string[];
}
```

#### PropertyDefinition.model

Определение модели объекта.

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class LatLng {
  @property(DataType.NUMBER)
  lat?: number;

  @property(DataType.NUMBER)
  lng?: number;
}

@model()
class Address {
  @property({
    type: DataType.OBJECT,
    model: LatLng.name, // <=
  })
  coordinates?: LatLng;
}
```

#### PropertyDefinition.primaryKey

Определение первичного ключа (по умолчанию свойство `id`).

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    primaryKey: true, // <=
  })
  id!: string;
}
```

#### PropertyDefinition.columnName

Определение названия колонки/свойства в базе данных.  
(по умолчанию имя свойства)

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    columnName: 'NAME', // <=
  })
  name?: string;
}
```

#### PropertyDefinition.required

Определение свойства обязательным (запрет [пустых значений](https://www.npmjs.com/package/@e22m4u/js-repository#Пустые-значения)).

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    required: true, // <=
  })
  name!: string;
}
```

#### PropertyDefinition.default

Определение значения по умолчанию.

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    default: 'John Doe', // <=
  })
  name?: string;
}
```

#### PropertyDefinition.validate

Использование предустановленных валидаторов.

- `minLength: number` - минимальная длина строки или массива;
- `maxLength: number` - максимальная длина строки или массива;
- `regexp: string | RegExp` - проверка по регулярному выражению;

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    validate: {
      minLength: 2,  // <=
      maxLength: 24, // <=
    },
  })
  name?: string;
}
```

*i. Для регистрации пользовательских валидаторов
см. раздел «Валидаторы» [основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository#валидаторы).*

#### PropertyDefinition.transform

Использование предустановленных трансформеров.

- `trim` - удаление пробельных символов с начала и конца строки;
- `toUpperCase` - перевод строки в верхний регистр;
- `toLowerCase` - перевод строки в нижний регистр;

```ts
import {property, DataType} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    transform: 'trim',
  })
  name?: string;
}
```

*i. Для регистрации пользовательских трансформеров
см. раздел «Трансформеры» [основного модуля](https://www.npmjs.com/package/@e22m4u/js-repository#трансформеры).*

#### PropertyDefinition.unique

Определение свойства уникальным.

```ts
import {property, DataType, PropertyUniqueness} from '@e22m4u/ts-repository';

@model()
class User {
  @property({
    type: DataType.STRING,
    unique: true, // <=
  })
  username!: string;
}
```

Режимы проверки.

- `PropertyUniqueness.STRICT` или `true` для строгой проверки;
- `PropertyUniqueness.SPARSE` не проверять *пустые значения**;
- `PropertyUniqueness.NON_UNIQUE` не проверять (по умолчанию);

*i. Подробнее о пустых значениях см. в [основном модуле](https://www.npmjs.com/package/@e22m4u/js-repository#Пустые-значения).*

### @relation(metadata: RelationMetadata)

Декоратор применяется к свойству экземпляра класса, определяя
тип связи к целевой модели.

- [Belongs To](#belongs-to) - ссылка через внешний ключ;
- [Has One](#has-one) - обратная сторона Belongs To (*один к одному*);
- [Has Many](#has-many) - обратная сторона Belongs To (*один ко многим*);
- [References Many](#references-many) - ссылка через массив идентификаторов;

Полиморфные версии:  
(модель определяется дискриминатором)

- [Polymorphic Belongs To](#belongs-to-полиморфная-версия) - ссылка через внешний ключ и дискриминатор;
- [Polymorphic Has One](#has-one-полиморфная-версия) - обратная сторона полиморфного Belongs To (*один к одному*);
- [Polymorphic Has Many](#has-many-полиморфная-версия) - обратная сторона полиморфного Belongs To (*один ко многим*);

#### Belongs To

Текущая модель ссылается на целевую используя внешний ключ.

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель Role
@model()
class Role {
  @property(DataType.STRING)
  name?: string;
}

// модель User
@model()
class User {
  @property(DataType.STRING)
  name?: string;

  @property(DataType.STRING)
  roleId?: string;

  @relation({
    type: RelationType.BELONGS_TO, // <=
    model: Role.name,
    foreignKey: 'roleId', // (не обязательно)
    // если "foreignKey" не указан, то название внешнего
    // ключа формируется по названию связи с добавлением
    // постфикса "Id"
  })
  role?: Role;
}
```

Документ *Role*.

```json
{
  "_id": "68a9c85f31f4414606e7da79",
  "name": "Manager"
}
```

Документ *User*.

```json
{
  "_id": "68a9c9b52eab80fa02ee6ccb",
  "name": "John Doe",
  "roleId": "68a9c85f31f4414606e7da79"
}
```

Извлечение документа *User* и разрешение связи `role`.

```ts
const user = await userRep.findOne({include: 'role'});
console.log(user);
// {
//   id: '68a9c9b52eab80fa02ee6ccb',
//   name: 'John Doe',
//   roleId: '68a9c85f31f4414606e7da79',
//   role: {
//     id: '68a9c85f31f4414606e7da79',
//     name: 'Manager'
//   }
// }
```

#### Has One

Целевая модель ссылается на текущую по принципу *один к одному*.  
*(обратная сторона [Belongs To](#belongs-to))*

```ts
import {model, relation, property, RelationType} from '@e22m4u/ts-repository';

// модель Profile
@model()
class Profile {
  @property(DataType.STRING)
  phone?: string;

  @property(DataType.STRING)
  address?: string;

  @property(DataType.STRING)
  userId?: string;

  @relation({
    type: RelationType.BELONGS_TO,
    model: User.name,
    // см. Belongs To
  })
  user?: User;
}

// модель User
@model()
class User {
  @property(DataType.STRING)
  name?: string;

  @relation({
    type: RelationType.HAS_ONE, // <=
    model: Profile.name,
    foreignKey: 'userId',
  })
  profile?: Profile;
}
```

Документ *Profile*.

```json
{
  "_id": "68a9c85f31f4414606e7da79",
  "phone": "+78005553535",
  "address": "101000, Moscow, Boulevard, 291",
  "userId": "68a9c9b52eab80fa02ee6ccb"
}
```

Документ *User*.

```json
{
  "_id": "68a9c9b52eab80fa02ee6ccb",
  "name": "John Doe"
}
```

Извлечение документа *User* и разрешение связи `profile`.

```ts
const user = await userRep.findOne({include: 'profile'});
console.log(user);
// {
//   id: '68a9c9b52eab80fa02ee6ccb',
//   name: 'John Doe',
//   profile: {
//     id: '68a9c85f31f4414606e7da79',
//     phone: '+78005553535',
//     address: '101000, Moscow, Boulevard, 291',
//     userId: '68a9c9b52eab80fa02ee6ccb'
//   }
// }
```

#### Has Many

Целевая модель ссылается на текущую по принципу *один ко многим*.  
*(обратная сторона [Belongs To](#belongs-to))*

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель Article
@model()
class Article {
  @property(DataType.STRING)
  title?: string;

  @property(DataType.STRING)
  authorId?: string;

  @relation({
    type: RelationType.BELONGS_TO,
    model: Author.name,
    // см. Belongs To
  })
  author?: Author;
}

// модель Author
@model()
class Author {
  @property(DataType.STRING)
  name?: string;

  @relation({
    type: RelationType.HAS_MANY, // <=
    model: Article.name,
    foreignKey: 'authorId',
  })
  articles?: Article[];
}
```

Коллекция *Articles*.

```json
[
  {
    "_id": "68a9ccc43fe39dd49b4d283c",
    "title": "The Bottle and the Babe",
    "authorId": "68a9c9b52eab80fa02ee6ccb"
  },
  {
    "_id": "68a9cd32f06233bba3aeadfe",
    "title": "The History Logs",
    "authorId": "68a9c9b52eab80fa02ee6ccb"
  }
]
```

Документ *Author*.

```json
{
  "_id": "68a9c9b52eab80fa02ee6ccb",
  "name": "John Doe"
}
```

Извлечение документа *Author* и разрешение связи `articles`.

```ts
const author = await authorRep.findOne({include: 'articles'});
console.log(author);
// {
//   id: '68a9c9b52eab80fa02ee6ccb',
//   name: 'John Doe',
//   articles: [
//     {
//       id: '68a9ccc43fe39dd49b4d283c',
//       title: 'The Bottle and the Babe',
//       authorId: '68a9c9b52eab80fa02ee6ccb'
//     },
//     {
//       id: '68a9cd32f06233bba3aeadfe',
//       title: 'The History Logs',
//       authorId: '68a9c9b52eab80fa02ee6ccb'
//     }
//   ]
// }
```

#### References Many

Связь через массив идентификаторов.

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель City
@model()
class City {
  @property(DataType.STRING)
  name?: string;
}

// модель User
@model()
class User {
  @property(DataType.STRING)
  name?: string;

  @property({
    type: DataType.ARRAY,
    itemType: DataType.STRING,
  })
  cityIds?: string[];

  @relation({
    type: RelationType.REFERENCES_MANY,
    model: City.name,
    foreignKey: 'cityIds',
  })
  cities?: City[];
}
```

Коллекция *Cities*.

```json
[
  {
    "_id": "68a9c79e0f69f169bd711d5d",
    "name": "Moscow"
  },
  {
    "_id": "68a9c839d0d046bcd43df978",
    "name": "Saint Petersburg"
  }
]
```

Документ *User*.

```json
{
  "_id": "68a9c85f31f4414606e7da79",
  "name": "John Doe",
  "cityIds": [
    "68a9c79e0f69f169bd711d5d",
    "68a9c839d0d046bcd43df978"
  ]
}
```

Извлечение документа *User* и разрешение связи `cities`.

```ts
const user = await userRep.findOne({include: 'cities'});
console.log(user);
// {
//   id: '68a9c85f31f4414606e7da79',
//   name: 'John Doe',
//   cityIds: [
//     '68a9c79e0f69f169bd711d5d',
//     '68a9c839d0d046bcd43df978'
//   ],
//   cities: [
//     {
//       id: '68a9c79e0f69f169bd711d5d',
//       name: 'Moscow'
//     },
//     {
//       id: '68a9c839d0d046bcd43df978',
//       name: 'Saint Petersburg'
//     }
//   ]
// }
```

#### Belongs To (полиморфная версия)

Текущая модель ссылается на целевую, используя внешний ключ и дискриминатор.

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель Author
@model()
class Author {
  @property(DataType.STRING)
  name?: string;

  @property(DataType.NUMBER)
  age?: number;
}

// модель Article
@model()
class Article {
  @property(DataType.STRING)
  title?: string;

  @property(DataType.STRING)
  content?: string;
}

// модель Image
@model()
class Image {
  @property(DataType.STRING)
  referenceId?: string;

  @property(DataType.STRING)
  referenceType?: string;

  @relation({
    type: RelationType.BELONGS_TO, // <=
    polymorphic: true,             // <=
    // полиморфный режим позволяет хранить название целевой модели
    // в свойстве-дискриминаторе, которое формируется согласно
    // названию связи с постфиксом "Type", и в данном случае
    // название целевой модели хранит "referenceType",
    // а идентификатор документа "referenceId"
    foreignKey: 'referenceId',     // (не обязательно)
    discriminator: 'referenceType' // (не обязательно)
  })
  reference?: Author | Article;
}
```

Документ *Author*.

```json
{
  "_id": "68a9c85f31f4414606e7da78",
  "name": "John Doe",
  "age": 24
}
```

Документ *Article*.

```json
{
  "_id": "68a9cfd16767b49624fd16d6",
  "title": "The History Logs",
  "content": "First published in 1912..."
}
```

Коллекция *Images*.

```json
[
  {
    "_id": "68a9c9b52eab80fa02ee6ccb",
    "path": "/storage/upload/12.png",
    "referenceType": "Author",
    "referenceId": "68a9c85f31f4414606e7da78"
  },
  {
    "_id": "68a9cfdf43fb7961ad68af1b",
    "path": "/storage/upload/13.png",
    "referenceType": "Article",
    "referenceId": "68a9cfd16767b49624fd16d6"
  }
]
```

Извлечение документов *Image* и разрешение связи `reference`.

```ts
const images = await imageRep.find({include: 'reference'});
console.log(images);
// [
//   {
//     id: '68a9c9b52eab80fa02ee6ccb',
//     path: '/storage/upload/12.png',
//     referenceType: 'Author',
//     referenceId: '68a9c85f31f4414606e7da78',
//     reference: {
//       id: '68a9c85f31f4414606e7da78',
//       name: 'John Doe',
//       age: 24
//     }
//   },
//   {
//     id: '68a9cfdf43fb7961ad68af1b',
//     path: '/storage/upload/13.png',
//     referenceType: 'Article',
//     referenceId: '68a9cfd16767b49624fd16d6',
//     reference: {
//       id: '68a9cfd16767b49624fd16d6',
//       title: 'The History Logs',
//       content: 'First published in 1912...'
//     }
//   }
// ]
```

#### Has One (полиморфная версия)

Целевая модель ссылается на текущую, используя внешний ключ и дискриминатор.  
*(обратная сторона полиморфной [Belongs To](#belongs-to-полиморфная-версия))*

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель Image
@model()
class Image {
  @property(DataType.STRING)
  referenceId?: string;

  @property(DataType.STRING)
  referenceType?: string;

  @relation({
    type: RelationType.BELONGS_TO,
    polymorphic: true,
    // см. Belongs To (полиморфная версия)
    foreignKey: 'referenceId',     // (не обязательно)
    discriminator: 'referenceType' // (не обязательно)
  })
  reference?: object;
}

// модель User
@model()
class User {
  @property(DataType.STRING)
  name?: string;

  @relation({
    type: RelationType.HAS_ONE,
    model: Image.name,        // название целевой модели
    polymorphic: 'reference', // название полиморфной связи целевой модели
    // вместо названия связи можно явно указать свойства целевой модели
    //   polymorphic: true,
    //   foreignKey: 'referenceId',
    //   discriminator: 'referenceType',
  })
  avatar?: Image;
}
```

Документ *Image*.

```json
{
  "_id": "68a9c9b52eab80fa02ee6ccb",
  "path": "/storage/upload/14.png",
  "referenceType": "User",
  "referenceId": "68a9c85f31f4414606e7da78"
}
```

Документ *User*.

```json
{
  "_id": "68a9c85f31f4414606e7da78",
  "name": "John Doe"
}
```

Извлечение документа *User* и разрешение связи `avatar`.

```ts
const user = await userRep.findOne({include: 'avatar'});
console.log(user);
// {
//   id: '68a9c85f31f4414606e7da78',
//   name: 'John Doe',
//   avatar: {
//     id: '68a9c9b52eab80fa02ee6ccb',
//     path: '/storage/upload/14.png',
//     referenceType: 'User',
//     referenceId: '68a9c85f31f4414606e7da78'
//   }
// }
```

#### Has Many (полиморфная версия)

Целевая модель ссылается на текущую, используя внешний ключ и дискриминатор.  
*(обратная сторона полиморфной [Belongs To](#belongs-to-полиморфная-версия))*

```ts
import {model, property, relation, RelationType} from '@e22m4u/ts-repository';

// модель Image
@model()
class Image {
  @property(DataType.STRING)
  referenceId?: string;

  @property(DataType.STRING)
  referenceType?: string;

  @relation({
    type: RelationType.BELONGS_TO,
    polymorphic: true,
    // см. Belongs To (полиморфная версия)
    foreignKey: 'referenceId',     // (не обязательно)
    discriminator: 'referenceType' // (не обязательно)
  })
  reference?: object;
}

// модель Gallery
@model()
class Gallery {
  @property(DataType.STRING)
  title?: string;

  @relation({
    type: RelationType.HAS_MANY,
    model: Image.name,        // название целевой модели
    polymorphic: 'reference', // название полиморфной связи целевой модели
    // вместо названия связи можно явно указать свойства целевой модели
    //   polymorphic: true,
    //   foreignKey: 'referenceId',
    //   discriminator: 'referenceType',
  })
  images?: Image[];
}
```

Коллекция *Images*.

```json
[
  {
    "_id": "68aa0db2dedc4922180b9ebf",
    "path": "/storage/upload/15.png",
    "referenceType": "Gallery",
    "referenceId": "68aa0d9bae2ef42208c2f4ec"
  },
  {
    "_id": "68aa0db7852e06b0c3a1662b",
    "path": "/storage/upload/16.png",
    "referenceType": "Gallery",
    "referenceId": "68aa0d9bae2ef42208c2f4ec"
  }
]
```

Документ *Gallery*.

```json
{
  "_id": "68aa0d9bae2ef42208c2f4ec",
  "title": "Photos of spring holidays."
}
```

Извлечение документа *Gallery* и разрешение связи `images`.

```ts
const user = await userRep.findOne({include: 'images'});
console.log(user);
// {
//   id: '68aa0d9bae2ef42208c2f4ec',
//   title: 'Photos of spring holidays.',
//   images: [
//     {
//       _id: '68aa0db2dedc4922180b9ebf',
//       path: '/storage/upload/15.png',
//       referenceType: 'Gallery',
//       referenceId: '68aa0d9bae2ef42208c2f4ec'
//     },
//     {
//       id: '68aa0db7852e06b0c3a1662b',
//       path: '/storage/upload/16.png',
//       referenceType: 'Gallery',
//       referenceId: '68aa0d9bae2ef42208c2f4ec'
//     }
//   ]
// }
```


## Тесты

```bash
npm run test
```

## Лицензия

MIT