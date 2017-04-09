describe("Matrix library", () => {
    let Matrix = window.Matrix;
    it("should create identity matrix", () => {
        let matrix = new Matrix();
        expect(matrix.data).toEqual(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
    });

    it("should be able to multiply 2 matrices together", () => {
        let matrix = new Matrix(
            [
                1, 2, 3, 4,
                1, 2, 3, 4,
                1, 2, 3, 4,
                1, 2, 3, 4,
            ]);
            // let matrix2 be the identity matrix
        let matrix2 = new Matrix();
        let result = matrix.multiply(matrix2);
        expect(result.data).toEqual(
            [
                1, 2, 3, 4,
                1, 2, 3, 4,
                1, 2, 3, 4,
                1, 2, 3, 4,
            ]);
    });

    it("should be able to translate a matrix", () => {
        let matrix = matrix.translate(1, 2, 3);
        expect(matrix.data).toEqual(
            [
                1, 0, 0, 1,
                0, 1, 0, 2,
                0, 0, 1, 3,
                0, 0, 0, 1,
            ]);
    });

    it("should be able to scale a matrix", () => {
        let matrix = matrix.scale(1, 2, 3);
        expect(matrix.data).toEqual(
            [
                1, 0, 0, 0,
                0, 2, 0, 0,
                0, 0, 3, 0,
                0, 0, 0, 1,
            ]);
    });

    it("should be able to rotate a matrix", () => {
        let matrix = matrix.rotate(1, 0, 1, 0);
        expect(matrix.data).toEqual(
            [
                Math.cos(Math.PI / 180.0), 0, Math.sin(Math.PI / 180.0), 0,
                0, 1, 0, 0,
                -1 * Math.sin(Math.PI / 180.0), 0, Math.cos(Math.PI / 180.0), 0,
                0, 0, 0, 1,
            ]);
    });

    it("should be able to get the orthoMatrix", () => {
        let matrix = matrix.orthoMatrix(5, 10, 5, 10, 5, 10);
        expect(matrix.data).toEqual(
            [
                2 / 5, 0, 0, -15 / 5,
                0, 2 / 5, 0, -15 / 5,
                0, 0, 2 / 5, -15 / 5,
                0, 0, 0, 1,
            ]);
    });

    it("should be able to get the perspectiveMatrix", () => {
        let matrix = matrix.perspective(5, 10, 5, 10, 5, 10);
        expect(matrix.data).toEqual(
            [
                2, 0, 15 / 5, 0,
                0, 2, 15 / 5, 0,
                0, -15 / 5, (-2 * 15) / 5, 0,
                0, 0, -1, 0,
            ]);
    });

    it("should be able to convert a matrix into an array for WebGL", () => {
        let matrix = new Matrix(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        expect(matrix.data).toEqual(
            [
                1,
                0,
                0,
                0,

                0,
                1,
                0,
                0,

                0,
                0,
                1,
                0,

                0,
                0,
                0,
                1
            ]
        );
    });
});
