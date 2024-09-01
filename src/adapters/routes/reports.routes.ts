import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import ReportUseCase from '../../application/use_cases/report.usecase';

import { GetReportDTO } from '../../domain/dto/reports.dto';

class ReportRoutes {
  public prefix_route = '/reports';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const reportUseCase = ReportUseCase.getInstance(instance.config);

    // POST
    instance.post<{
      Body: GetReportDTO;
    }>(
      '',
      {
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await reportUseCase.getReport(request.body);
        reply.send(response);
      },
    );

    done();
  }
}

export default ReportRoutes;
