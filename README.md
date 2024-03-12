<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Source

- [Build Nest.js Microservices With RabbitMQ, MongoDB & Docker | Tutorial](https://www.youtube.com/watch?v=yuVVKB0EaOQ)
- [NestJS CLI Workspaces](https://docs.nestjs.com/cli/monorepo)
- [NestJS Microservice](https://docs.nestjs.com/microservices/basics#event-based)
- [NestJS Microservice RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq)
- [NestJS Mongo](https://docs.nestjs.com/techniques/mongodb#model-injection)

## Description

![](./image/2024-03-11-14-11-13.png)

- Mono Repo의 구조
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
      └ common
  ```
  - 실행
  ```sh
  npm run start:dev
  npm run start:dev billing
  ```
