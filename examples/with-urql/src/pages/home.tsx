
import { query, gql } from '@knockout-js/ice-urql/request';
import { useQuery } from '@knockout-js/ice-urql/runtime';
import { userPermissions } from '@knockout-js/api';

const pokemonsQuery = gql`query pokemons{
  pokemons(limit:5){
    id,name
  }
}`;

export default function Home() {
  const [result] = useQuery({
    query: pokemonsQuery,
    context: {
      instanceName: 'instance2'
    }
  });
  const { data, fetching, error } = result;
  return (
    <>
      <div>
        <h2>测试useQuery：</h2>

        {fetching && <p>Loading...</p>}

        {error && <p>Oh no... {error.message}</p>}

        {data && (
          <ul>
            {data.pokemons.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>instanceName 2：<button onClick={async () => {
          const result = await query(pokemonsQuery, {}, { instanceName: 'instance2' },);
          console.log(result)
        }}>请求</button> </h2>
      </div>
      <div>
        <h2>测试query：<button onClick={async () => {
          const result = await query(pokemonsQuery, {});
          console.log(result)
        }}>请求</button> </h2>

      </div>
      <div>
        <h2>测试权限请求：<button onClick={async () => {
          const result = await userPermissions('aaa')
          console.log(result)
        }}>请求</button> </h2>

      </div>
      <div>
        <h2>测试网络异常：<button onClick={async () => {
          const result = await query(pokemonsQuery, {}, {
            url: '/xxx'
          });
          console.log(result)
        }}>请求</button> </h2>

      </div>
    </>
  );
}

export function pageConfig() {
  return {
    title: 'Home',
  };
}
