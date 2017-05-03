/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
((canvas) => {
    let Shape = window.Shape;
    let Mesh = window.Mesh;
    let GLSLUtilities = window.GLSLUtilities;
    let Matrix = window.Matrix;
    // let Matricies = window.Matricies;

    let gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let sun = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 1, g: 0.85, b: 0.3 },
        translateValues: {tx: -3.3, ty: -1.2, tz: 0},
        scaleValues: {sx: 0.75, sy: 0.75, sz: 0.75},
        axisValues: { rx: -3.3, ry: 1.2, rz: 0 },
        currentRotation: 3,
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES});

    let redPlanet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        translateValues: {tx: 1.3, ty: -1.2, tz: 0},
        scaleValues: {sx: 0.7, sy: 0.7, sz: 0.7},
        axisValues: { rx: 1.3, ry: 1.2, rz: 0 },
        currentRotation: 3,
        color: { r: 1, g: 0, b: 0 },
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    let bluePlanet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 0, g: 1, b: 1 },
        translateValues: {tx: -1, ty: 1.5, tz: 0},
        scaleValues: {sx: 0.6, sy: 0.6, sz: 0.6},
        axisValues: { rx: -1, ry: 1.2, rz: 0 },
        currentRotation: 6,
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    let purplePlanet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 1, g: 0, b: 1 },
        currentRotation: 4,
        translateValues: {tx: 3.1, ty: 1.2, tz: 0},
        scaleValues: {sx: 0.6, sy: 0.6, sz: 0.6},
        axisValues: {rx: 3.1, ry: 1.2, rz: 0 },
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    let pyramid = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.pyramid()),
        color: { r: 1, g: 0, b: 1},
        translateValues: {tx: 2.1, ty: 0.5, tz: 0},
        scaleValues: {sx: 1, sy: 1, sz: 1},
        vertices: Mesh.toRawTriangleArray(Shape.pyramid()),
        mode: gl.TRIANGLES
    });

    let planet = new Shape({
        specularColors: {r: 0.4, g: 0, b: 1},
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 0, g: 0.4, b: 0.3},
        currentRotation: 8,
        translateValues: {tx: -2, ty: 1, tz: -2},
        scaleValues: {sx: 1, sy: 1, sz: 1},
        axisValues: {rx: 3.1, ry: 3.2, rz: 3.1 },
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    // Initialize the shaders.
    let abort = false;
    let shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        (shader) => {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        (shaderProgram) => {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    let vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    let vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    let vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    let normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    let modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    let projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    let lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    let lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    let lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    let shininess = gl.getUniformLocation(shaderProgram, "shininess");

    let rotateMatrix = gl.getUniformLocation(shaderProgram, "rotateMatrix");
    let scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");
    let translateMatrix = gl.getUniformLocation(shaderProgram, "translateMatrix");
    let cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    /*
     * Displays an individual object, including a transformation that now varies
     * for each object drawn.
     */
    let drawObject = (object) => {
        object.vertexBuffer = GLSLUtilities.initVertexBuffer(gl, object.vertices);
        object.colorBuffer = GLSLUtilities.initVertexBuffer(gl, object.colors);
        object.specularBuffer = GLSLUtilities.initVertexBuffer(gl, object.specularColors);
        object.normalBuffer = GLSLUtilities.initVertexBuffer(gl, object.normals);
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        gl.uniform1f(shininess, object.shininess);

        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(object.matrix.conversion()));

        gl.uniformMatrix4fv(translateMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.translate(
          xposition * object.translateValues.tx, yposition * object.translateValues.ty,
          object.translateValues.tz)).conversion()));

        gl.uniformMatrix4fv(scaleMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.scale(
          object.scaleValues.sx, object.scaleValues.sy, object.scaleValues.sz)).conversion()));

        gl.uniformMatrix4fv(rotateMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.rotate(
          currentRotation * object.currentRotation, object.axisValues.rx, object.axisValues.ry,
          object.axisValues.rz)).conversion()));

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
    let drawScene1 = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, Matrix.camera(0, 0, 0, 0, 0, -1, 0, 1, 0).conversion());
        let objectsToDraw = [
            sun,
            redPlanet,
            bluePlanet,
            purplePlanet
        ];
        objectsToDraw.forEach(drawObject);
        // All done.
        gl.flush();
    };

    let drawScene2 = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, Matrix.camera(2, 0, 2, 0, 0, -2, 0, 2, 0).conversion());

        let objectsToDraw = [
            pyramid,
            planet
        ];
        console.log(objectsToDraw);
        objectsToDraw.forEach(drawObject);
        gl.flush();
    };

    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, new Float32Array(Matrix.orthoMatrix(
        -2 * (canvas.width / canvas.height),
        2 * (canvas.width / canvas.height),
        -2,
        2,
        -10,
        10
    ).conversion()));

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, [-1500.0, 1000.0, 100.0, 1.0]);
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

    let animationActive = false;
    let currentRotation = 0.0;
    let acceleration = -0.0098;
    let previousTimestamp = null;

    let currentFrame = 0;
    let velocity = 0.0;
    let xposition = 1;
    let yposition = 1;
    let lastPosition = null;
    let lastVelocity = null;
    const floor = -1;
    const friction = 0.909999;

    const FRAMES_PER_SECOND = 60;
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND;
    const DEGREES_PER_MILLISECOND = 0.033;
    const FULL_CIRCLE = 360.0;

    let advanceScene = (timestamp) => {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }
        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < MILLISECONDS_PER_FRAME) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        velocity += acceleration;

        if (yposition < floor) {
            velocity = -velocity;
            velocity *= friction;
            yposition += velocity;
        } else {
            yposition += velocity;
        }

        if (xposition < -4) {
            velocity = -velocity;
            velocity *= friction;
            xposition += velocity;
        } else {
            xposition += velocity;
        }

        lastVelocity = velocity;

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene1();
        lastPosition = yposition;

        currentFrame = 1;

        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    let scene2animation = (timestamp) => {
        if (!animationActive) {
            return;
        }
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(scene2animation);
            return;
        }
        var progress = timestamp - previousTimestamp;
        if (progress < MILLISECONDS_PER_FRAME) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(scene2animation);
            return;
        }

        velocity += 0.01;
        velocity = -velocity;
        yposition += velocity;

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene2();
        currentFrame = 1;

        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(scene2animation);
    };

    $("#clear").click(function() {
        animationActive = false;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    });

    $("#scene1").click(function() {
        drawScene1();
        animationActive = true;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

    $("#scene2").click(function() {
        drawScene2();
        animationActive = true;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(scene2animation);
        }
    });

})(document.getElementById("webgl"));
