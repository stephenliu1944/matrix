/** 
 * 该类用于开发调试, 打包时会忽略此文件.
 */
import Matrix from '../src/index';
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';

export const links = [
    {
        name: 'Home',
        href: '/app0/home'
    },
    {
        name: 'List',
        href: '/app0/list'
    }
];
  
render(
    <Router>
        <div>
            {links.map(link => {
                return (
                    <Link key={link.href} className="p-6" to={link.href}>
                        {link.name}
                    </Link>
                );
            })}
        </div>
    </Router>,
    document.getElementById('app')
);

var matrix = new Matrix({
    applications: [{
        name: 'app0',
        path: '/app0',
        props: {},
        dependencies: {
            scripts: [
                'app0.vendors.chunk.js', 
                'app0.main.js'
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
                'app1.main.js'
            ],
            styles: [
                'app1.main.css'
            ]
        }
    }],
    props: {            // 全局属性
    },             
    hooks: {
        // beforeLoad: function | array,
        // beforeInit: function | array,
        // afterInit: function | array,
        // beforeMount: function | array,
        // afterMount: function | array,
        // beforeUnmount: function | array,
        // afterUnmount: function | array,
        // changeProps: function | array,
        // onError: function | array
    }
});

matrix.start();