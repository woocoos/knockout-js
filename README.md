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

测试版本的打包与发布
```
# 设置测试版本
pnpm changeset pre enter alpha   # 设置 alpha 版本
pnpm changeset pre enter beta    # 设置 beta 版本
pnpm changeset pre enter rc      # 设置 rc 版本

# 要修改版本的包
pnpm changeset

#发布测试版本
pnpm changeset publish

#退出 Prereleases 模式
pnpm changeset pre exit
```
