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

    let currentPlanet = new Shape({
        normals: Mesh.toVertexNormalArray(Shape.sphere()),
        color: { r: 0, g: 1, b: 0 },
        translateValues: {tx: -0.4, ty: -4.65, tz: 0},
        scaleValues: {sx: 5, sy: 5, sz: 5},
        axisValues: { rx: -0.4, ry: -4.65, rz: 0 },
        vertices: Mesh.toRawTriangleArray(Shape.sphere()),
        mode: gl.TRIANGLES
    });

    let ship = new Shape({
        normals: Mesh.toNormalArray(Shape.pyramid()),
        color: { r: 1, g: 0, b: 1 },
        translateValues: {tx: 0, ty: -1.6, tz: 0},
        scaleValues: {sx: 0.4, sy: 0.4, sz: 0.4},
        axisValues: { rx: 0, ry: 1.0, rz: 1.0 },
        vertices: Mesh.toRawTriangleArray(Shape.pyramid()),
        mode: gl.TRIANGLES
    });

    // Build the objects to display.
    let objectsToDraw = [
        sun,
        redPlanet,
        bluePlanet,
        purplePlanet,
        currentPlanet,
        ship
    ];
      // console.log(objectsToDraw);

    // Pass the vertices to WebGL.
    objectsToDraw.forEach((objectToDraw) => {
        objectToDraw.vertexBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.vertices);
        objectToDraw.colorBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.colors);
        objectToDraw.specularBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.specularColors);
        objectToDraw.normalBuffer = GLSLUtilities.initVertexBuffer(gl, objectToDraw.normals);
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
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        gl.uniform1f(shininess, object.shininess);
        // translation(object.tx, )
        // sceneTranslation(0,0,0);


        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(object.matrix.conversion()));

        gl.uniformMatrix4fv(translateMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.translate(
          object.translateValues.tx, object.translateValues.ty, object.translateValues.tz)).conversion()));

        gl.uniformMatrix4fv(scaleMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.scale(
          object.scaleValues.sx, object.scaleValues.sy, object.scaleValues.sz)).conversion()));

        gl.uniformMatrix4fv(rotateMatrix, gl.FALSE, new Float32Array(object.matrix.multiply(Matrix.rotate(
          currentRotation * object.currentRotation, object.axisValues.rx, object.axisValues.ry,
          object.axisValues.rz)).conversion()));

          console.log(object);
          console.log(Matrix.translate(
            2, object.translateValues.ty, object.translateValues.tz).conversion());
        //   console.log(object.matrix);
        //   console.log(object.tx, object.ty, object.tz);
        //   console.log(object.translate(
        //     object.tx, object.ty, object.tz));
        // gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, new Float32Array(object.matrix.orthoMatrix(
        //     -2 * (canvas.width / canvas.height),
        //     2 * (canvas.width / canvas.height),
        //     -2,
        //     2,
        //     -10,
        //     10
        // ).conversion()));
        //
        // console.log(object.matrix.conversion());
        // console.log(new Float32Array(object.matrix.orthoMatrix(
        //     -2 * (canvas.width / canvas.height),
        //     2 * (canvas.width / canvas.height),
        //     -2,
        //     2,
        //     -10,
        //     10
        // ).conversion()));

        // sun.translate(1, 1, 0);


        // let currentMatrix = new Matrix();
        //
        // gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(
        //   Matrix.rotate(object.currentRotation * currentRotation,
        //   object.axis.x,
        //   object.axis.y,
        //   object.axis.z)
        // .conversion()));
        //
        // gl.uniformMatrix4fv(translateMatrix, gl.FALSE, new Float32Array(
        //   Matrix.translate(
        //     object.translate.tx,
        //     object.translate.ty,
        //     object.translate.tz)
        // .conversion()));
        //


        // let translate = Matrix.translate(
        //        object.translate.tx,
        //        object.translate.ty,
        //        object.translate.tz
        //    );
        //
        // // sun.translate(1, 0, 1);
        //
        // let rotate = Matrix.rotate(
        //     object.currentRotation * currentRotation,
        //     object.axis.x,
        //     object.axis.y,
        //     object.axis.z
        // );
        //
        // let scale = Matrix.scale(
        //      object.scale.sx,
        //      object.scale.sy,
        //      object.scale.sz
        //    );
        //
        // let translated = currentMatrix.multiply(translate);
        // let scaled = currentMatrix.multiply(scale);
        //
        // let rotated = currentMatrix.multiply(rotate);

        // object.translate(0, position, 0);

        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(currentMatrix.conversion()));
        // gl.uniformMatrix4fv(translateMatrix, gl.FALSE, new Float32Array(translated.conversion()));
        // gl.uniformMatrix4fv(scaleMatrix, gl.FALSE, new Float32Array(scaled.conversion()));
        // gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(rotated.conversion()));

        sun.translate(2, 0, 1);

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
    let drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(Matrix.scale())
        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(Matrix.rotate)

        gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, Matrix.camera(0, 0, 0, 0, 0, -1, 0, 1, 0).conversion());
        // sun.translate(1, 1, 0);
        // drawAllObjects(objectsToDraw.forEach(drawObject));
        // sun.scale(0.2, 0.2,);

        objectsToDraw.forEach(drawObject);

        // objectsToDraw.forEach((object) => {
        //     object.drawObject(translateMatrix);
        // });


        // console.log(sun.translate(1, 1, 0));

        // sun.translate(1, 1, 0);
        // console.log(sun.translate(1, 1, 0));

        // All done.
        gl.flush();
    };

    // drawScene();
    // console.log(new Float32Array(Matricies.orthoMatrix(
    //     -2 * (canvas.width / canvas.height),
    //     2 * (canvas.width / canvas.height),
    //     -2,
    //     2,
    //     -10,
    //     10
    // ).conversion()));

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
    let acceleration = -0.098;
    let previousTimestamp = null;

    let currentFrame;
    let velocity = 0;
    let position = 0;
    let lastPosition = null;
    let lastVelocity = null;

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

        velocity += lastVelocity + acceleration * currentFrame;

        if (position < -2) {
            velocity += -1;
            position += lastPosition + velocity;
        } else {
            position = lastPosition * velocity;
        }
        // position = velocity * currentFrame;

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;
        drawScene();
        lastPosition = position;
        lastVelocity = velocity;
        currentFrame += 1;

        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    $(canvas).click(() => {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

    // $("#ship").click(function() {
    //     ship1();
    // });

    // Draw the initial scene.
    drawScene();

})(document.getElementById("webgl"));
