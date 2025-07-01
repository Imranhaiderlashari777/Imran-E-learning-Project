'use strict';

module.exports = (plugin) => {
  // Enable REST API routes
  plugin.routes['content-api'].routes.push(
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.callback',
      config: {
        prefix: '',
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/local/register',
      handler: 'auth.register',
      config: {
        prefix: '',
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: 'user.find',
      config: {
        prefix: '',
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/users',
      handler: 'user.create',
      config: {
        prefix: '',
        policies: [],
        auth: false,
      },
    }
  );

  return plugin;
};
