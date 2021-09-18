# matrix
微前端框架

## Install
```
npm i matrix
```

## Usage
### 1. 注册
```html
<script type="systemjs-importmap">
{
    "imports": {
        // common
        "react": "https://cdn.jsdelivr.net/npm/react@16.13.0/umd/react.production.min.js",
        "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16.13.0/umd/react-dom.production.min.js",
        // 微应用1
        "app0.main.css": "//localhost:8080/assets/css/main.css",
        "app0.vendors.chunk.js": "//localhost:8080/assets/js/vendors.chunk.js",
        "app0.main.js": "//localhost:8080/assets/js/main.js",
        // 微应用2
        "app1.main.css": "//localhost:8081/assets/css/main.css",
        "app1.vendors.chunk.js": "//localhost:8081/assets/js/vendors.chunk.js",
        "app1.main.js": "//localhost:8081/assets/js/main.js"
    }
}
</script>
```

### 2. 配置

#### 主应用
index.js
```js
var matrix = new Matrix({
    applications: [{
        name: 'app0',
        path: '/app0',
        props: {},
        dependencies: {
            scripts: [
                'app0.vendors.chunk.js',
                'app0.main.js'          // 入口文件放最后
            ],
            styles: [
                'app0.main.css'
            ]
        }
    }, {
        name: 'app1',
        path: '/app1',
        props: {},
        dependencies: {
            scripts: [
                'app1.vendors.chunk.js',
                'app1.main.js'          // 入口文件放最后
            ],
            styles: [
                'app1.main.css'
            ]
        }
    }],
    hooks: {
        propsChange
    }
});

matrix.start();
```

#### 微应用
index.js
```js
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

var container;
export function init(app) {
    container = document.createElement('div');
    document.body.appendChild(container);
}

export function mount(app) {
    render(
        <Root app={app} />,
        container
    );
}

export function unmount(app) {
    unmountComponentAtNode(container);
}
```

## Application Lifecycle
```js
export function init(app) {}

export function mount(app) {}

export function unmount(app) {}

export function load(app) {}    // TODO

export function getConfig() {}  // TODO
```

## API
```js
var matrix = new Matrix({
    applications: [{
        name: string,
        path: boolean | string | function | regexp,
        props: object,
        dependencies: string | {
            scripts: array,
            styles: array
        },
        hooks: {
            beforeLoad: function | array,
            beforeInit: function | array,
            afterInit: function | array,
            beforeMount: function | array,
            afterMount: function | array,
            beforeUnmount: function | array,
            afterUnmount: function | array,
            onError: function | array
        }
    }],
    // TODO: 预留配置
    loader: {
        hooks: object
    },
    // TODO: 预留配置
    router: {
        hooks: object
    },
    //全局的参数
    props: object,
    // TODO: 预留配置
    hooks: object
});
// TODO
```

## 开发环境

### 主应用
```html
<script type="systemjs-importmap">
{
    "imports": {
        "react": "https://cdn.jsdelivr.net/npm/react@16.13.0/umd/react.production.min.js",
        "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16.13.0/umd/react-dom.production.min.js",
        "app0.main.css": "//localhost:8080/assets/css/main.css",
        "app0.vendors.chunk.js": "//localhost:8080/assets/js/vendors.chunk.js", 
        "app0.main.js": "//localhost:8080/assets/js/main.js",
        "app1.main.css": "//localhost:8081/assets/css/main.css",
        "app1.vendors.chunk.js": "//localhost:8081/assets/js/vendors.chunk.js", 
        "app1.main.js": "//localhost:8081/assets/js/main.js"
    }
}
</script>
```

### 微应用
webpack.config.js
```js
output: {
    libraryTarget: 'system',
    publicPath: '//localhost:8080/',
    jsonpFunction: appName
},
module: {
    rules: [{
        parser: {
            system: false    // 不编译system模块的文件
        }
    }, {
        /**
         * 主项目的css
         */
        test: /\.(css|less|scss)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: appName + '__[local]--[hash:base64:5]',
                    ...
                }
            }
            ...
        ]
    ...
    }]
}
...
```

## 生产环境

### 主应用
```html
<script type="systemjs-importmap">
{
    "imports": {
        "react": "https://cdn.jsdelivr.net/npm/react@16.13.0/umd/react.production.min.js",
        "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16.13.0/umd/react-dom.production.min.js",
        "app0.main.css": "//localhost:8080/assets/css/main.f46d907ea36c44faac2e.css",
        "app0.vendors.chunk.js": "//localhost:8080/assets/js/vendors.chunk.f46d907ea36c44faac2e.js", 
        "app0.main.js": "//localhost:8080/assets/js/main.f46d907ea36c44faac2e.js",
        "app1.main.css": "//localhost:8081/assets/css/main.66e581889b5275cfd495.css",
        "app1.vendors.chunk.js": "//localhost:8081/assets/js/vendors.chunk.66e581889b5275cfd495.js", 
        "app1.main.js": "//localhost:8081/assets/js/main.66e581889b5275cfd495.js"
    }
}
</script>
```

### 微应用
webpack.config.js
```js
// TODO: 未完成
output: {
    libraryTarget: 'system',
    publicPath: '//www.xxx.com/',
    jsonpFunction: appName
},
module: {
    // 同开发环境
}
...
```

## TODO List
1. 主应用调用 history.pushState() 和 history.replaceState() 方法不能触发微应用的路由变化事件, 但location.hash, history.go(), history.forward(), history.back()方法可以.

2. react-router@3 只支持静态路由, 不支持多个实例, 在多个微应用同时存在时会报错.

3. 开发生产环境区别

4. 打包部署

5. 生产环境测试