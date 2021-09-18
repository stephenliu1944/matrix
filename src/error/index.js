export default class MatrixError extends Error {
    constructor(message) {
        super(message);

        this.details = undefined;
    }
}