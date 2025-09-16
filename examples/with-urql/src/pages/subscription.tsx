import store from "@/store"
import { gid, instanceName } from "@knockout-js/api"
import { gql, subscription, query } from "@knockout-js/ice-urql/request"
import { DictText } from "@knockout-js/org"
import { request } from "ice"

const
  subQuery = gql`subscription{
    message{
      topic,
      sendAt,
      title,
      content,
      url,
      format,
    }
  }`,
  nodeQuery = gql`query node($gid:GID!){
    node(id:$gid){
      id
      ... on User{
        id,displayName
      }
    }
  }`,
  testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NzY2OTI2LCJpYXQiOjE2OTQ3NjMzMjYsImp0aSI6InRva2VuOjE6MmE3ZWU3OTQtZGUxNy00NTYxLWI4ZWEtZmM5MWFiOWRjYWNhIn0.c4TVHy5wIYPYMgYinjJbQIyATIYyLPCl2Ojgc7nZN3Q'

export default () => {
  const [, userDispatchers] = store.getModel('user')

  return <>
    <h1>测试URQL订阅</h1>
    <DictText dictCode="sex" value="male"></DictText>
    <div>
      <button onClick={async () => {
        const result = await query(nodeQuery, {
          gid: gid('User', 1),
        }, { instanceName: 'msg' });
        console.log(result)
      }}>普通请求</button>
      <button onClick={async () => {
        const result = await request.post('/mock-api/error-400')
        console.log(result)
      }}>ice request</button>
    </div>
    <br />
    <div>
      <button onClick={async () => {
        subscription(subQuery, { test: Date.now() }).subscribe((result) => {
          console.log(result.data.message)
        });

      }}>订阅</button>
    </div>
    <br />
    <div>
      <button onClick={async () => {
        userDispatchers.updateToken(testToken);
      }}>切换token</button>
    </div>
    <br />
    <div>
      <button onClick={async () => {
        const result = await query(`query userInfo($gid: GID!) {
            node(id: $gid) {
              ... on User {
                id
                principalName
                displayName
              }
              __typename
            }
          }`, {
          "gid": "VXNlcjox"
        }, {
          instanceName: "mock-adminx",
        });
        console.log(result)
      }}>测试可用</button>
    </div>
    <br />
    <div>
      <button onClick={async () => {
        const result = await query(`query listDatesUnTrade($dates: [LocalDate]) {
            listDatesUnTrade(dateList: $dates) {
              date
              noTradeList
              halfDayLis
              __typename
            }
          }`, {
          "dates": [
            "2025-09-01",
            "2025-09-02",
          ]
        }, { instanceName: 'meta_gql' });
        console.log(result)
      }}>测试异常</button>
    </div>

  </>
}
