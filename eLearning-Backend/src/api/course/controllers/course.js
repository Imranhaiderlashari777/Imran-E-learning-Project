'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
  async create(ctx) {
    try {
      const user = ctx.state.user;

      if (!user || !user.id) {
        return ctx.unauthorized('You must be logged in.');
      }

      const requestData = ctx.request.body?.data || {};

      // Inject instructor ID from authenticated user
      requestData.instructor = user.id;

      const response = await super.create({
        ...ctx,
        request: {
          ...ctx.request,
          body: { data: requestData },
        },
      });

      return response;
    } catch (error) {
      strapi.log.error('💥 Course create error:', error);
      return ctx.internalServerError('Could not create course.');
    }
  },
}));
