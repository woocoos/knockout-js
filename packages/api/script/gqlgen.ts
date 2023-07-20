import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  generates: {
    "src/gql/ucenter/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      schema: "script/__generated__/ucenter.graphql",
      documents: "src/ucenter/**/*.ts",
    }
  },
  ignoreNoDocuments: true,
}


export default config
