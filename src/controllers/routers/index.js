import users from './users.routes';
import lists from './lists.routes';
import items from './items.routes';
import auths from './auths.routes';

const router = (app) => {
  const prefix = '/api';
  app.use(`${prefix}/users`, users);
  app.use(`${prefix}/lists`, lists);
  app.use(`${prefix}/items`, items);
  app.use(`${prefix}/auths`, auths);
};

export default router;
