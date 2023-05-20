# 🏆 IPL legue 서비스 소개

서든어택 IPL 무소속 리그 ( https://cafe.naver.com/safriendship )의 래더 시스템을 도입하기 위해서 시작하는 프로젝트입니다

# 기획 의도

> 🏆 서든어택 무소속 리그 IPL에 **래더 시스템**을 도입해보자 !
> <br><br>서든어택 3보급을 즐기는 분이라면 서플라이 (https://3rd.supply/)의 존재를 아는 분들이 존재할 것 이라고 생각합니다
> <br>**서플라이** 는 현재 몇가지 문제가 있는 시스템인데(시스템의 에러가 아닌 사용자들의 잘못된 사용법) 그 문제를 해결한 서비스를 제공하려고 합니다
> <br><br>1. 게시판의 익명성 보장으로 인한 무분별한 혐오와 비방이 난무하고 있습니다
> <br>2. 원하지 않는 래더 공개로 게임을 하면서도 래더를 신경쓰느라 스트레스를 받고 있습니다
> <br><br>저희 **legue of IPL**은 두 문제를 해결하며 더 좋은 서비스를 제공하기 위하여 기획을 시작했습니다

# 메인/서브 서비스

### 😀 메인 서비스

1. IPL리그에 대한 래더 점수를 반영합니다 승률, 킬/데스 또한 포함됩니다

### 😀 서브 서비스

2. 게임 내의 닉네임을 사용하는 서비스를 제공합니다 (게시판의 무분별한 욕설, 비방을 단절하고자)

# 기능 구조

![LegueOfIPL](https://user-images.githubusercontent.com/105709970/214522017-98ec1771-6f8a-454f-843f-58c7574ba20f.jpg)

# 세부 기능(참조 https://3rd.supply/)

❗개인 래더 ( https://3rd.supply/league/supply/player/302465883 )

❗클랜 래더 ( https://3rd.supply/league/supply/clan/nb222223 )

❗클랜 랭킹( https://3rd.supply/league/supply/rank/clan/1 )

❗개인 랭킹 ( https://3rd.supply/league/supply/rank/player )

<br>

# Roadmap

- [x] SuddenAttack data crawling

- [x] Crawling data custom

- [x] Database Insert custom data

- [x] crawling and DB insert Scheduling (evenry 30minute)

- [ ] Insert query refactoring with transaction

- [ ] get query to show client

- [ ] front-end

<br>

# run to server

기존 RDS 요금이 너무 과다하게 많이 나와서 Docker로 postgreSQL 서버를 띄워 사용중입니다

```
// .env set-up

DB_USER = ${ custom variable db user }
DB_PASSWORD = ${ custom variable db password }
DB_NAME_DEVELOPMENT = ${ custom variable db name }
```

# docker compose up

```
// 기존 docker postgreSQL 컨테이너가 존재할수 있기 때문에 5433 포트를 사용중입니다

docker-compose up
```

# .development.env

```
// .development.env


NODE_ENV = development

SERVER_PORT =8080

DB_USER = ${ custom variable db user }
DB_PASS = ${ custom variable db password }
DB_NAME_DEVELOPMENT = ${ custom variable db name }
DB_HOST= 0.0.0.0
DB_PORT= 5433
DB_DIALECT = postgres
```

# run server -- watch

```
yarn start:dev
```
