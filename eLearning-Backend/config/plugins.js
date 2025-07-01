module.exports = ({ env }) => ({
    'users-permissions': {
    enabled: true,
  },
    upload: {
      config: {
        provider: '@strapi/provider-upload-cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
          secure: true,
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  });
  