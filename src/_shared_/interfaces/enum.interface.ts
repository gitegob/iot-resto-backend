export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CONFIRMED = 'CONFIRMED',
  SERVED = 'SERVED',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum TableStatus {
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  SERVED = 'SERVED',
  FREE = 'FREE',
}

export enum PgErrors {
  UNIQUE_VIOLATION = '',
  NOT_NULL_VIOLATION = '',
}

export enum TableStatusQuery {
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  SERVED = 'SERVED',
  FREE = 'FREE',
  ALL = 'ALL',
}
