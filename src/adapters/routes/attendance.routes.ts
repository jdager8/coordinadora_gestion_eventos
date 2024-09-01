import fs from 'fs';
import path from 'path';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import AttendanceUseCase from '../../application/use_cases/attendance.usecase';

import {
  AttendanceDTO,
  FindByEventIdDTO,
  FindByUserIdAndEventIdAttendanceDTO,
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

    instance.get<{ Params: { id: number }; Reply: FindByEventIdDTO[] }>(
      '/events/:id',
      {
        schema: attendanceSchema.findByEventId,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await attendanceUseCase.findByEventId(
          request.params.id,
        );
        reply.send(response);
      },
    );

    instance.get<{
      Params: { eventId: number; userId: number };
      Reply: FindByUserIdAndEventIdAttendanceDTO[];
    }>(
      '/events/:eventId/:userId',
      {
        schema: attendanceSchema.findByUserIdAndEventId,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await attendanceUseCase.findByUserIdAndEventId(
          request.params.userId,
          request.params.eventId,
        );
        reply.send(response);
      },
    );

    instance.get(
      '/template',
      {
        schema: attendanceSchema.template,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (_request, reply) => {
        const filePath = path.join(
          __dirname,
          '../../assets',
          instance.config.EM_ATTENDANCE_TEMPLATE_FILE,
        );
        fs.readFile(filePath, (err, fileBuffer) => {
          reply.header(
            'Content-Disposition',
            `attachment; filename=${instance.config.EM_ATTENDANCE_TEMPLATE_FILE}`,
          );
          reply.header(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          );

          reply.send(err || fileBuffer);
        });
        return reply;
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
          (request.user as any).user as UserDTO,
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
