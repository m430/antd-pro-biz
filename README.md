# antd-pro-biz
🐜 ant design biz is an advance biz components library.

## Usage

```bash
npm install --save antd-pro-biz antd-pro-toolkit
```

```javascript
import { AddressSelector } from 'antd-pro-biz';
```

## Components

- [x] AddressSelector

## token
Some story need to comunicate with server to fetch data, and need to login first, so you need to create a token file(`token.js`) like below, otherwise you will get some error.

``` javascript
import Des from './utils/des';

export const username = "user"
export const password = Des.enc("*******")
```
