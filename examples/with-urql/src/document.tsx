import { Meta, Title, Links, Main, Scripts } from '@ice/runtime';

function Document() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="ICE 3 Example for plugin request." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Title />
        <Links />
      </head>
      <body>
        <Main />
        {/* <script crossOrigin="" src="https://jsd.onmicrosoft.cn/npm/react@18.2.0/umd/react.production.min.js"></script>
        <script crossOrigin="" src="https://jsd.onmicrosoft.cn/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
        <script crossOrigin="" src="https://jsd.onmicrosoft.cn/npm/dayjs@1.11.10/dayjs.min.js"></script>
        <script crossOrigin="" src="https://jsd.onmicrosoft.cn/npm/antd@5.6.3/dist/antd.min.js"></script> */}
        <Scripts />
      </body>
    </html>
  );
}

export default Document;
