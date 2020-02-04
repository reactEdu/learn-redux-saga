## json-server
- Access-Control-Allow-Origin: *로 되어있어서 cors 이슈가 없는 API 테스트용 서버
- data.json 파일 생성

```javascript
{
  "posts": [
    {
      "id": 1,
      "title": "연우",
      "body": "스타일 원탑"
    },
    {
      "id": 2,
      "title": "아이린",
      "body": "얼굴 원탑"
    },
    {
      "id": 3,
      "title": "설현",
      "body": "몸매 원탑"
    }
  ]
}
```

- npx json-server ./data.json --port 4000
- http://localhost:4000/posts 접속해보면 json 데이터 보임
- 특정 데이터 처리(특정 데이터만 보이느냐, 특정 데이터만 가져오느냐)
  - http://localhost:4000/posts?id=1 이런식으로 파라미터에 맞는 데이터만 보여줄수도 가능(배열 안에 해당 객체 존재)
  - http://localhost:4000/posts/1 이렇게 아이디를 매칭해서 해당하는 데이터를 가져올수 있음(해당 객체만 존재)

- post man을 통해서 CRUD 구현도 가능함
  - insert: post메서드로 데이터를 보냄
  - update: put메서드로 데이터를 보냄
  - delete: delete메서드로 url/해당아이디로 요청

## Proxy
- 웹팩 개발서버의 Proxy 서버 구축
- package.json
  - "proxy": "http://localhost:4000"
