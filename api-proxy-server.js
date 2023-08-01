const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const ALLOWED_ORIGIN = "http://localhost:4200";

// Logging
app.use(morgan('dev'));

const corsHandler = cors({ credentials: true, origin: ALLOWED_ORIGIN });
app.use(corsHandler)
app.options('*', corsHandler)

function proxyPath(from, to) {
    app.use(from, corsHandler, createProxyMiddleware({
        target: to,
        pathRewrite: { [`^${from}`]: '' },
        changeOrigin: false,
        onProxyRes: (res) => {
            res.headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
            res.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS, POST, DELETE, PUT, PATCH';
            res.headers['Access-Control-Max-Age'] = '86400';
            res.headers['Access-Control-Allow-Credentials'] = 'true'
        }
    }));
}

// Proxy config
proxyPath(
    '/api/authentication',
    'http://127.0.0.1:11001'
);
proxyPath(
    '/api/masterdata',
    'http://127.0.0.1:11071'
);
proxyPath(
    '/api/resource',
    'http://127.0.0.1:11031'
);
proxyPath(
    '/api/medical',
    'http://127.0.0.1:11041'
);
proxyPath(
    '/api/invoice',
    'http://127.0.0.1:11051'
);
proxyPath(
    '/api/dictionary',
    'http://127.0.0.1:11021'
);
proxyPath(
    '/api/utility',
    'http://127.0.0.1:11101'
);


// Start Proxy
app.listen(PORT, HOST, () => console.log(`Started Proxy at ${HOST}:${PORT}`));
