export default function getCorsOptions() {
  return {
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  };
}
