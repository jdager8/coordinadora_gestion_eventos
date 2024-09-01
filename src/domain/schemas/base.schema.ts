function responseSchema(
  statusCode: number,
  isErrorResponse: boolean | null = null,
  data: any = null,
) {
  return {
    type: 'object',
    description: `Response status code: ${statusCode}`,
    properties: {
      statusCode: { type: 'number', default: statusCode },
      message: { type: 'string' },
      data: data
        ? { ...data }
        : { type: 'object', nullable: true, default: null },
      error: { type: 'boolean', default: isErrorResponse },
    },
  };
}

export { responseSchema };
