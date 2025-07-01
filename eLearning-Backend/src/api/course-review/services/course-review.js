'use strict';

/**
 * course-review service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::course-review.course-review');
