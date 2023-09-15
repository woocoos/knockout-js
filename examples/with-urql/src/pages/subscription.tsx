import { gid } from "@knockout-js/api"
import { gql, subscription, query } from "@knockout-js/ice-urql/request"

const subQuery = gql`subscription{
  message{
    action,payload,key,topic,sendAt
  }
}`

const nodeQuery = gql`query node($gid:GID!){
  node(id:$gid){
    id
    ... on User{
      id,displayName
    }
  }
}`

export default () => {
  return <>
    <h1>测试URQL订阅</h1>
    <div>
      <button onClick={async () => {
        const result = await query(nodeQuery, {
          gid: gid('user', 1),
        }, { instanceName: 'msg' });
        console.log(result)
      }}>普通请求</button>
    </div>
    <br />
    <div>
      <button onClick={async () => {
        const result = await subscription(subQuery, {});
        console.log(result)
      }}>订阅</button>
    </div>
  </>
}
