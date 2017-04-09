describe("Shape implementation", () => {
    let Shape = window.Shape;

    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("3D-scene-fixture.html");
    });

    afterEach(() => {
        fixture.cleanup();
    });

    describe("creating and data access", () => {
        it("should instantiate a proper shape", () => {
            // let gl = window.GLSLUtilities.getGL(document.getElementById("test-canvas"));
            let shape = new Shape();
            expect(shape.vertices).toBe(0);
            expect(shape.indices).toBe(0);
        });

        it("should create a cube", () => {

        });
    });



});
