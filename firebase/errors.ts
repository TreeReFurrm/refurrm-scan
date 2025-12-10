export class FirestorePermissionError extends Error {
  constructor(message = 'Permission denied') {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}
