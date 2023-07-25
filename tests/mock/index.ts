import { setupServer } from 'msw/node'
import { graphql } from 'msw'
import { afterAll, afterEach, beforeAll } from 'vitest'

const data = {
  organizations: {
    totalCount: 2,
    edges: [
      { node: { id: 1, name: 'org1' } },
      { node: { id: 2, name: 'org2' } },
    ]
  }
}

const graphqlHandlers = [
  graphql.query(
    'orgList',
    (req, res, ctx) => {
      return res(ctx.data(data))
    }
  ),
]

export const mockServer = () => {
  const server = setupServer(...graphqlHandlers)
  // 在所有测试之前启动服务器
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

  // 所有测试后关闭服务器
  afterAll(() => server.close())

  // 每次测试后重置处理程序 `对测试隔离很重要`
  afterEach(() => server.resetHandlers())
}


