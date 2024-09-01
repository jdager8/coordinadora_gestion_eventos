import fs from 'fs';

import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import AttendanceUseCase from '../../application/use_cases/attendance.usecase';

import {
  AttendanceDTO,
  UploadResponseDTO,
} from '../../domain/dto/attendance.dto';
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

    instance.get(
      '/template',
      {
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (_request, reply) => {
        const file = fs.createReadStream('attendanceTemplate.xlsx', 'utf8');
        reply.header(
          'Content-Disposition',
          'attachment; filename=attendanceTemplate.xlsx',
        );
        reply.header('Content-Type', 'application/octet-stream');
        await reply.send(file);
      },
    );

    instance.post<{ Body: AttendanceDTO; Reply: AttendanceDTO }>(
      '/register',
      {
        schema: attendanceSchema.register,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await attendanceUseCase.registerAttendance(
          request.body,
          request.user as UserDTO,
        );
        reply.send(response);
      },
    );

    instance.post<{ Reply: UploadResponseDTO }>(
      '/upload',
      {
        schema: attendanceSchema.upload,
        preValidation: [
          instance.authorize,
          instance.adminUser,
          instance.validateFile,
        ],
      },
      async (request: any, reply) => {
        const file = request.body.template;
        const response = await attendanceUseCase.loadAttendanceFromTemplate(
          file,
          request.user.user as UserDTO,
        );

        reply.send(response);
      },
    );

    done();
  }
}

export default AttendanceRoutes;
