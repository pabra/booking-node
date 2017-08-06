const bodyParserOptions = {
    extendTypes: {
        json: ['text/plain'],
    },
};
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const body = require('koa-bodyparser')(bodyParserOptions);
const midWare = require('./lib/middlewares');
const tok = midWare.validToken;
const cors = require('kcors');
const logger = require('./lib/logger');
const routes = require('./lib/routes');
const loadSchema = require('./lib/db').loadSchema;
const corsOptions = {
    // origin: true,
    origin: '*',
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
};

// app.use(bodyParser.json({type: ['json', 'text']}));
// app.use(midWare.token);
// app.use(cors(corsOptions));

router.get('/', routes.getIndex);
router.get('/reloadDb', routes.reloadDb); // TODO: remove
router.get('/item/:uid/:yearMonth', routes.getUnavailItemPeriod);
router.get('/group/:uid/:yearMonth', routes.getUnavailGroupPeriod);
router.get('/auth', routes.auth);

router.post('/item/:uid/:from..:to', body, routes.postItemBooking);
router.post('/new_account', routes.newAccount);

// token required
router.post('/company/:uid', tok, body, routes.updateCompany);
router.post('/itemGroup/:uid', tok, routes.updateItemGroup);
router.post('/item/:uid', tok, body, routes.updateItem);

router.put('/group/:companyUid/:newGroupName', tok, routes.putGroup);

router.get('/companies', tok, routes.getCompanies);
router.get('/users', tok, routes.getUsers);
router.get('/groups/:companyUid', tok, routes.getGroups);
router.get('/items/:groupUid', tok, routes.getItems);

app
    .use(cors(corsOptions))
    .use(midWare.token)
    .use(router.routes())
    .use(router.allowedMethods());

loadSchema();

app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
});
