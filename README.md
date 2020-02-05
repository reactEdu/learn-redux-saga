# redux-saga
- 리덕스 사가는 액션을 모니터링 하는 개념(리덕스 썽크가 액션을 함수로 해서 dispatch)
- 장점(복잡한 비동기 처리에 용이)
  - 비동기 작업을 진행할 때 기존 요청을 취소 가능
  - 특정 액션 발생시 다른 액션을 디스패치 혹은 특정 코드 실행 가능
  - 웹소켓 사용시 Channel 기능 사용해서 코드 관리 용이
  - 비동기 작업 실패시 재시도 기능 구현 가능

## json-server&Proxy 세팅
- 백엔드 구축안하고 테스트를 위해 json-server부터 실행
  - [json-server&Proxy 세팅](/NOTE/json-server&Proxy.md "json-serverk")

## 목차
- [리덕스 사가 사용법](/NOTE/redux-saga.md "saga")
- [리덕스 사가에서 promise처리](/NOTE/promise_handling.md "saga")
- [리덕스 사가에서 router과 state 사용](/NOTE/router&state_in_saga.md "saga")

## [참고] 리덕스 작업 순서
- npm i redux react-redux
- modules 폴더에 파일 생성
  - 액션, 액션생성함수, 리듀서 생성
- index 파일 생성
  - 루트리듀서 생성
- 프로젝트에 리덕스 적용
  - index.js에 store 생성해서 Provider 적용
- 컨테이너 컴포넌트 생성
  - 내부에 프리젠테이셔널 컴포넌트 삽입