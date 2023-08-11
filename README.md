# React component monorepo template. Based on `@ice/pkg`.

## Quick Start

```bash
# Install Dependencies.
$ pnpm i 
# Build and link packages.
$ pnpm packages:build
# Start watch service
$ pnpm start
```

## Packages

```shell
pnpm create @ice/pkg packages/new-lib --workspace
```

## Usage

local:
```
 yalc add @knockout-js/api
```

## Changeset

添加需更新的包
```
pnpm changeset add
```

设置好更新包的版本
```
pnpm changeset version
```

查看文件消耗状态
```
pnpm changeset status
```

发布
```
pnpm changeset publish
```
