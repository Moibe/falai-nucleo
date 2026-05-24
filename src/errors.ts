export class NucleoError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'NucleoError';
  }
}
