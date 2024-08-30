class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}

class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

class DuplicateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateException';
  }
}

class ForeignKeyConstraintException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForeignKeyConstraintException';
  }
}

export {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  DuplicateException,
  ForeignKeyConstraintException,
};
