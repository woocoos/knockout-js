import { useRequest } from '@knockout-js/ice-urql/request';
import { gql } from 'urql';

const LOCATIONS_QUERY = gql`
  query Locations($query: String!) {
    locations(query: $query) {
      id
      name
    }
  }
`;
export default function Home() {
  const [result] = useRequest({
    query: LOCATIONS_QUERY,
    variables: { query: 'LON' },
  });
  const { data, fetching,error } = result;
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
