
import { useEffect } from 'react';
import { queryRequest } from '@knockout-js/ice-urql/request';
import { useQuery } from '@knockout-js/ice-urql/runtime';
import { gql } from 'urql';

const LOCATIONS_QUERY = gql`query schemaTypes{
  __schema {
    types {
      name
    }
  }
}`;

export default function Home() {
  const [result] = useQuery({
    query: LOCATIONS_QUERY,
  });
  const { data, fetching, error } = result;

  useEffect(() => {
    queryRequest('instance2', LOCATIONS_QUERY, {}).then(result => {
      console.log(result)
    })
  }, [])


  return (
    <div>
      {fetching && <p>Loading...</p>}

      {error && <p>Oh no... {error.message}</p>}

      {data && (
        <ul>
          {data.locations.map(location => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function pageConfig() {
  return {
    title: 'Home',
  };
}
