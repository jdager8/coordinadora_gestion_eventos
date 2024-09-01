import App from './src/infraestructure/server/server';

import AuthRoutes from './src/adapters/routes/auth.routes';
import UserRoutes from './src/adapters/routes/users.routes';
import EventRoutes from './src/adapters/routes/events.routes';
import EnrollmentRoutes from './src/adapters/routes/enrollment.routes';
import AttendanceRoutes from './src/adapters/routes/attendance.routes';

import SwaggerPlugin from './src/infraestructure/plugins/swagger.plugin';
import MultiPartPlugin from './src/infraestructure/plugins/multipart.plugin';
import EnvPlugin from './src/infraestructure/plugins/env.plugin';
import JwtPlugin from './src/infraestructure/plugins/jwt.plugin';
import RbacPlugin from './src/infraestructure/plugins/rbac.plugin';
import FilePlugin from './src/infraestructure/plugins/file.plugin';
import ReportRoutes from './src/adapters/routes/reports.routes';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [
      EnvPlugin,
      MultiPartPlugin,
      SwaggerPlugin,
      JwtPlugin,
      RbacPlugin,
      FilePlugin,
    ],
    [Symbol.for('routes')]: [
      AuthRoutes,
      UserRoutes,
      EventRoutes,
      EnrollmentRoutes,
      AttendanceRoutes,
      ReportRoutes,
    ],
  });
}

bootstrap();
