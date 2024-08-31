import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import EnrollmentUseCase from '../../application/use_cases/enrollment.usecase';

import { enrollmentSchema } from '../../domain/schemas/enrollment.schema';
import {
  CreateEnrollmentDTO,
  UpdateEnrollmentDTO,
} from '../../domain/dto/enrollment.dto';

class EnrollmentRoutes {
  public prefix_route = '/enrollments';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const enrollmentUseCase = EnrollmentUseCase.getInstance(instance.config);

    instance.post<{ Body: CreateEnrollmentDTO }>(
      '/enroll',
      {
        schema: enrollmentSchema.enroll,
      },
      async (request, reply) => {
        const response = await enrollmentUseCase.enrollUser(request.body);
        reply.send(response);
      },
    );

    instance.post<{ Body: UpdateEnrollmentDTO }>(
      '/unenroll',
      {
        schema: enrollmentSchema.unenroll,
      },
      async (request, reply) => {
        const response = await enrollmentUseCase.unenrollUser(request.body);
        reply.code(204).send(response);
      },
    );

    done();
  }
}

export default EnrollmentRoutes;
