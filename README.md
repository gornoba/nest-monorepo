<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Index <!-- omit in toc -->

- [Source](#source)
- [Mono Repo의 구조](#mono-repo의-구조)
- [Library](#library)
  - [auth](#auth)
  - [database](#database)
  - [rmq](#rmq)
- [Apps](#apps)
  - [auth](#auth-1)
  - [billing](#billing)
  - [orders](#orders)
- [Docker](#docker)
  - [Docker](#docker-1)
  - [Docker Compose](#docker-compose)
- [auth의 작동설명](#auth의-작동설명)
  - [module의 import 내역](#module의-import-내역)
  - [Source](#source-1)
    - [auth/users](#authusers)
    - [login](#login)
    - [validateUser](#validateuser)
- [billing 작동설명](#billing-작동설명)
  - [module의 import 내역](#module의-import-내역-1)
  - [Source](#source-2)
    - [order\_created](#order_created)
- [order 작동설명](#order-작동설명)
  - [module의 import 내역](#module의-import-내역-2)
  - [Source](#source-3)
    - [order\_created](#order_created-1)
  - [getOrders](#getorders)

## Source

- [Build Nest.js Microservices With RabbitMQ, MongoDB & Docker | Tutorial](https://www.youtube.com/watch?v=yuVVKB0EaOQ)
- [NestJS CLI Workspaces](https://docs.nestjs.com/cli/monorepo)
- [NestJS Microservice](https://docs.nestjs.com/microservices/basics#event-based)
- [NestJS Microservice RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq)
- [NestJS Mongo](https://docs.nestjs.com/techniques/mongodb#model-injection)

## Mono Repo의 구조

<div align="center">
  <img src="./image/monorepo.png" alt='mono-repo'>
</div>

- 하나의 프로젝트를 작은 단위로 나누고 하나의 repository로 관리
- 장점
  - 종속성과 버전을 통합적으로 관리하여 호환성 및 종속성 관리를 단순화
  - 코드 공유와 재사용이 용이
- 단점 - 저장소의 크기가 커질수록, 체크아웃, 빌드, 검색 등의 작업이 느려질 수 있음 - 세밀한 접근 권한 설정과 보안 관리가 어려워질 수 있음 - 빌드 시스템을 효율적으로 관리하기 위해 복잡한 설정과 최적화가 필요
- 폴더구조

```
├─ apps
│   ├ auth
│   ├ billing
│   └ orders
└─ libs
    ├ database
    └ rabbitmq
```

- 실행

```sh
npm run start:dev
npm run start:dev billing
```

## Library

- 각각의 apps에서는 동일한 모듈 컴포넌트나 다른 컨텍스트를 재사용해야할 경우가 있음
- 이것을 공유할 수 있게 해주는 것이 library
- [Nestjs Libraries](https://docs.nestjs.com/cli/libraries)

### auth

- 모든 app에서 사용할 수 있는 인증 도구 생성
- 메세지를 생산할 수 있게 RmqModule

### database

- MongoDB에 접속할 수 있는 module
- 재사용이 가능한 \_id 생성을 위한 추상화 클래스를 선언한 schema
- 재상용이 가능하고 공통적으로 사용하는 추상화 클래스의 method가 있는 repository

### rmq

- Dynamic Module을 사용하여 clientproxy를 설정하여 메세지를 생산 할 수 있는 module
- RabbitMQ를 사용하여 Microservice를 만들어 메세지를 소비할 수 있는 service
- 메세지를 ack하는 service

## Apps

### auth

- [rmq](#rmq)에서 만든 서비스를 이용하여 microsercie 생성
  - 하이브리드로 작성됨 [Hybrid application](https://docs.nestjs.com/faq/hybrid-application)
- 사용자 인증을 위한 Guard 설정 [NestJS authentication](https://docs.nestjs.com/security/authentication)
- passport로 함께 사용하여 인증 [NestJS passport](https://docs.nestjs.com/recipes/passport#jwt-functionality)

### billing

- [rmq](#rmq)에서 만든 서비스를 이용하여 microsercie 생성
  - 하이브리드로 작성됨 [Hybrid application](https://docs.nestjs.com/faq/hybrid-application)
- controller
  - fire-and-forget 패턴의 EventPattern을 사용하여 응답을 보내지 않고 emit 받은 정보 처리
  - RabbitMQ 기본옵션에 noAck 설정하여 emit을 받으면 ack해줄 서비스 필요

### orders

- Rest API의 역할
- Module
  - [NestJS configuration](https://docs.nestjs.com/techniques/configuration)
    - Schema validation로 Joi를 사용
  - MongoDB Connection 설정 및 Schema
  - RabbitMQ Connection 설정
- Service
  - 주문은 orders repository에서 처리하고 billing은 billing moulde에서 처리하게 emit
  - ClientProxy는 Observable stream을 return함으로 rxjx를 사용
- 그외
  - DTO는 데이터가 간단하여 간단한 class-validator 사용
  - [dockerfile](#docker-1)

## Docker

### Docker

- stage를 development와 production으로 분리
- docker compose는 development 스테이지까지 진행

### Docker Compose

- orsers, billing, rabbitmq, mongodb (replica 2)
- app service
  - Dockerfile이 root 폴더를 기준으로 실행됨으로 context: .
  - target을 develoment로 apps에 맞는 command 필요
  - 그외 경로에 맞게 내용을 수정했으며 microservice만 있는 app은 포트삭제
- rabbitmq
  - [DockerHub rabbitmq](https://hub.docker.com/_/rabbitmq)
- mongodb
  - [DockerHub bitnami/mongodb](https://hub.docker.com/r/bitnami/mongodb)
  - Postgres만 써봐서.. 무지 헷갈렸음..

---

★ [NestJS lifecyle](https://docs.nestjs.com/faq/request-lifecycle)

- 만약 이 글을 읽고 있다면 작동설명을 읽기 전에 반드시 NestJS lifecycle에 대해 숙지하길 바랍니다.
- lifecycle 이외에도 여러가지 알아야 할 것이 있지만 NestJS가 이렇게 작동한다를 이해하려면 다른 것보다 우선적으로 알아야 한다고 생각합니다.
- NestJS를 오랫동안 해왔는데 MonoRepo는 복잡해보였습니다. 익숙해진다면 프로젝트를 수행하는데 도움이 많이 될 것 같습니다.

---

## auth의 작동설명

### module의 import 내역

- DatabaseModule
  - 추상화된 repository와 schema를 주입받기 위해
- UserModule
  - 사용자 생성을 위한 Rest API를 생성하고 root module에 주입
- RmqModule
  - 메세지를 생산하기 위하여 main.ts에 RmqService를 주입하기 위해
- ConfigModule
  - 환경변수를 사용하기 위해
- JwtModule
  - Jwt token을 sign, verify하기 위해

### Source

#### auth/users

- Post
- 유저를 생성하기 위해 사용한다.
- Repository에서 사용자가 있는지 확인 후 유저생성

#### login

- Post
- local strategy에서 사용자가 유효한지 판단
- true가 return되면 jwt token을 생성하고 Authentication 이름으로 쿠키를 만든다.

#### validateUser

- MessagePattern
- jwtguard 및 jwtmodule을 사용하여 token을 verify
- repository에서 \_id로 검색하여 유저를 찾고 결과를 return
  - http의 요청의 경우 request.user
  - rpc의 요청의 경우 data.user
- CurrentUser 이름의 custome decorator로 user를 return

---

## billing 작동설명

### module의 import 내역

- RmqModule
  - 메세지를 소비하기 위하여 main.ts에 RmqService를 주입
- ConfigModule
  - 환경변수를 사용하기 위해
- AuthModule
  - 사용자 인증을 위해

### Source

#### order_created

- EventPattern
- UniversalJwtAuthGuard를 이용하여 사용자 인증
  - [auth](#auth)
  - RPC임으로 data 안의 Authentication을 추적
  - validate_user 이름으로 메세지 생산
    - [validateUser](#validateUser)가 소비
  - data.user에 user 정보 주입
- 생산된 메세지를 소비
  - payload 데이터를 logger로 출력
- 메세지 ack를 위해 [Rmq ack service](#rmq) 사용

---

## order 작동설명

### module의 import 내역

- DatabaseModule
  - 추상화된 repository와 schema를 주입받기 위해
- AuthModule
  - 사용자 인증을 위해
- RmqModule
  - 메세지를 생산하기 위하여 dynamic module 사용
- ConfigModule
  - 환경변수를 사용하기 위해
- MongooseModule
  - 스키마 생성을 위해

### Source

#### order_created

- Post
- UniversalJwtAuthGuard를 이용하여 사용자 인증
  - [auth](#auth)
  - HTTP임으로 Requst의 Cookie 안의 Authentication을 추적
  - validate_user 이름으로 메세지 생산
    - [validateUser](#validateUser)가 소비
  - request.user에 user 정보 주입
- repository를 사용하여 db에 order 입력
- order_created 이름으로 메세지를 생산하여 billing 생성
  - [billing app order_created](#order_created)
- 생성한 order return

### getOrders

- GET
- Repository를 이용해서 전체 주문 불러온다.
