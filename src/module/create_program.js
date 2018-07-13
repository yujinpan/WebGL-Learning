/**
 * 程序对象的生成和着色器连接
 */
export default function create_program(gl, vs, fs) {

    // 程序对象生成
    let program = gl.createProgram();

    // 分配着色器
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // 连接着色器
    gl.linkProgram(program);

    // 判断是否连接成功
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

        // success
        gl.useProgram(program);

        return program;
    } else {

        // error msg
        alert(gl.getProgramInfoLog(program));
    }
}