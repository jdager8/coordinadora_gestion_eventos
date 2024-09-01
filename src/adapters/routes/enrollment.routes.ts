import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import EnrollmentUseCase from '../../application/use_cases/enrollment.usecase';

import {
  CreateEnrollmentDTO,
  UpdateEnrollmentDTO,
} from '../../domain/dto/enrollment.dto';

import { enrollmentSchema } from '../../domain/schemas/enrollment.schema';
class EnrollmentRoutes {
  public prefix_route = '/enrollments';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const enrollmentUseCase = EnrollmentUseCase.getInstance(instance.config);

    instance.get(
      '',
      {
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        const response = await enrollmentUseCase.findAll();
        reply.send(response);
      },
    );

    instance.post<{ Body: CreateEnrollmentDTO }>(
      '/enroll',
      {
        schema: enrollmentSchema.enroll,
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        const response = await enrollmentUseCase.enrollUser(request.body);
        reply.send(response);
      },
    );

    instance.delete<{ Querystring: UpdateEnrollmentDTO }>(
      '/unenroll',
      {
        schema: enrollmentSchema.unenroll,
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        const response = await enrollmentUseCase.unenrollUser(request.query);
        reply.code(204).send(response);
      },
    );

    done();
  }
}

export default EnrollmentRoutes;
