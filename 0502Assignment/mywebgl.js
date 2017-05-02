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

    // let position = 0;

    let sun = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 1, g: 0.85, b: 0.3 },
        translateValues: {tx: -3.3, ty: 1.2, tz: 0},
        scaleValues: {sx: 0.75, sy: 0.75, sz: 0.75},
        axisValues: { rx: -3.3, ry: 1.2, rz: 0 },
        currentRotation: 3,
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES});

    let redPlanet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        translateValues: {tx: 1.3, ty: 1.2, tz: 0},
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
        translateValues: {tx: -1, ty: 1.2, tz: 0},
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

    let ship = new Shape({
        normals: Mesh.toNormalArray(Shape.pyramid()),
        color: { r: 1, g: 0, b: 1 },
        currentRotation: 2,
        translateValues: {tx: 2, ty: 4, tz: 0},
        scaleValues: {sx: 0.4, sy: 0.4, sz: 0.4},
        axisValues: { rx: -4, ry: 4, rz: 0},
        vertices: Mesh.toRawTriangleArray(Shape.pyramid()),
        mode: gl.TRIANGLES
    });

    let planet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 0, g: 1, b: 0},
        currentRotation: 4,
        translateValues: {tx: 0, ty: 0, tz: 0},
        scaleValues: {sx: 1.5, sy: 1.5, sz: 1.5},
        axisValues: {rx: 3.1, ry: 1.2, rz: 0 },
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    // Build the objects to display.
    let objectsToDraw = [
        sun,
        redPlanet,
        bluePlanet,
        purplePlanet
        // currentPlanet
        // ship
    ];
      // console.log(objectsToDraw);

    // Pass the vertices to WebGL.
    // objectsToDraw.forEach((objectToDraw) => {
    //     objectToDraw.vertexBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.vertices);
    //     objectToDraw.colorBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.colors);
    //     objectToDraw.specularBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.specularColors);
    //     objectToDraw.normalBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.normals);
    // });

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
          object.translateValues.tx, position * object.translateValues.ty,
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
        objectsToDraw.forEach(drawObject);
        // All done.
        gl.flush();
    };

    let drawScene2 = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, Matrix.camera(2, 0, 2, 0, 0, -2, 0, 2, 0).conversion());

        let objectsToDraw = [
            planet,
            ship,
        ]

        objectsToDraw.forEach(drawObject);
        // All done.
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
    let position = 0;
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

        if (position < floor) {
            velocity = -velocity;
            velocity *= friction;
            position += velocity;
        } else {
            position += velocity;
        }
        // currentRotation += 1;
        // position = velocity * currentFrame;

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene1();
        lastPosition = position;
        lastVelocity = velocity;
        currentFrame = 1;

        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    let miniScene = (timestamp) => {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(miniScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < MILLISECONDS_PER_FRAME) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(miniScene);
            return;
        }

        // velocity += acceleration;

        if (position < floor) {
        //     velocity = -velocity;
        //     velocity *= friction;
            position += velocity;
        // } else {+
        //     xposition += velocity;
        }

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene2();
        // lastPosition = position;
        // lastVelocity = velocity;
        currentFrame += 1;

        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(miniScene);
    };


    $(canvas).click(() => {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

    $("#ship").click(function() {
        drawScene2();
        animationActive = !animationActive;
        if (animationActive) {
              // drawObject(ship);
            previousTimestamp = null;
            window.requestAnimationFrame(miniScene);
        }

        // $(canvas).click(() => {
        //     animationActive = !animationActive;
        //     if (animationActive) {
        //         previousTimestamp = null;
        //         window.requestAnimationFrame(miniScene);
        //     }
        // });
        // drawObject(currentPlanet);
        // drawObject(ship);


      // console.log("draw", drawObject(ship));
        // drawObject(ship);
    });

    // Draw the initial scene.
    drawScene1();

})(document.getElementById("webgl"));
