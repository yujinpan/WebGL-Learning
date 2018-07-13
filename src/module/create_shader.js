/**
 * 生成和编译着色器
 * 
 * @param {str} id 
 */
const SHADER = {

    // 顶点着色器
    vs: `
        attribute vec3 position;
        uniform mat4 mvpMatrix;

        void main(void) {
            gl_Position = mvpMatrix * vec4(position, 1.0);
        }
    `,

    // 片段着色器
    fs: `
        void main(void) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `
};

export default function create_shader(gl, name) {

    // 着色器
    let shader = null;

    switch (name) {
        case 'vs':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        case 'fs':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        default:
            return;
    }

    // 分配code给着色器
    gl.shaderSource(shader, SHADER[name]);

    // 编译着色器
    gl.compileShader(shader);

    // 判断是否编译成功
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        // success
        return shader;
    } else {

        // error msg
        alert(gl.getShaderInfoLog(shader));
    }
}