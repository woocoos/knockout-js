import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  generates: {
    "src/gql/ucenter/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      schema: "script/generated/ucenter.graphql",
      documents: [
        "src/ucenter/**/*.ts",
        "../org/src/**/*.tsx",
        "../layout/src/components/aggregate-menu/*.tsx",
        "../layout/src/components/layout/*.tsx",
        "../layout/src/components/tenant-dropdown/*.tsx",
      ],
    },
    "src/gql/msgcenter/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      schema: "script/generated/msgcenter.graphql",
      documents: [
        "../layout/src/components/msg-dropdown/*.tsx",
      ],
    },
  },
  ignoreNoDocuments: true,
}


export default config
