import {graphql} from "msw";

export const handlers = [
  graphql.query('orgList', (req, res, ctx) => {
    const {username} = req.variables
    return res(
      ctx.data({
        organizations: {
          edges: [
            {node: {id: 1, name: 'org1'}},
            {node: {id: 2, name: 'org2'}},
          ],
          totalCount: 2
        }
      }),
    )
  }),
]

export default handlers
