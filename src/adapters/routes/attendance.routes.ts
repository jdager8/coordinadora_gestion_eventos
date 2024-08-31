import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import AttendanceUseCase from '../../application/use_cases/attendance.usecase';

import { AttendanceDTO } from '../../domain/dto/attendance.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import { attendanceSchema } from '../../domain/schemas/attendance.schema';

class AttendanceRoutes {
  public prefix_route = '/attendances';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const attendanceUseCase = AttendanceUseCase.getInstance(instance.config);

    instance.post<{ Body: AttendanceDTO; Reply: AttendanceDTO }>(
      '/register',
      {
        schema: attendanceSchema.register,
      },
      async (request, reply) => {
        const response = await attendanceUseCase.registerAttendance(
          request.body,
          request.user as UserDTO,
        );
        reply.send(response);
      },
    );

    instance.post(
      '/upload',
      {
        schema: attendanceSchema.register,
      },
      async (request, reply) => {
        reply.send('Uploading attendance');
      },
    );

    done();
  }
}

export default AttendanceRoutes;
