export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum TableStatus {
  WAITING = 'WAITING',
  FREE = 'FREE',
}

export enum PgErrors {
  UNIQUE_VIOLATION = '',
  NOT_NULL_VIOLATION = '',
}

export enum TableStatusQuery {
  WAITING = 'WAITING',
  FREE = 'FREE',
  ALL = 'ALL',
}

export enum Role {
  SITE_ADMIN = 'SITE_ADMIN',
  RESTO_ADMIN = 'RESTO_ADMIN',
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
}
