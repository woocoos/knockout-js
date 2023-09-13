import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
        title: '@knockout-js',
        path: 'packages',
        navBarTitle: 'knockout-js',
        favicon: "https://qlcdn.oss-cn-shenzhen.aliyuncs.com/cdn/woocoos/favicon.ico",
        navBarLogo: "https://qlcdn.oss-cn-shenzhen.aliyuncs.com/cdn/woocoos/woocoo.png",
        sidebarItemsGenerator: (args: any) => {
          // The index.md doc should not be the category, so we rewrite the default isCategoryIndex function.
          function isCategoryIndex({ fileName, directories }: any) {
            const eligibleDocIndexNames: string[] = [
              'readme',
              directories[0].toLowerCase(),
            ];
            return eligibleDocIndexNames.includes(fileName.toLowerCase());
          }
          const defaultSidebarItems = args.defaultSidebarItemsGenerator({
            ...args,
            isCategoryIndex,
          });
          // 1. Remove the `docs` category.
          // 2. Remove category link.
          const newSidebarItems = defaultSidebarItems.map(({ link, ...rest }: any) => ({
            ...rest,
            items: rest.items.map((item: any) => item.items).flat().filter(item => item),
          }));

          return newSidebarItems;
        },
        exclude: ['**/node_modules/**'],
        onBrokenLinks: 'warn',
        pageRouteBasePath: '/',
        url: 'https://woocoos.github.io',
        baseUrl: "/knockout-js/",
        remarkPlugins: [
          "require('@ice/remark-react-docgen-docusaurus')"
        ]
      },
    ],
  ],
});
