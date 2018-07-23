import { WebGLUtils } from './lib/webgl-utils';
import { WebGLDebugUtils } from './lib/webgl-debug';
import { initShaders, createProgram, loadShader, getWebGLContext } from './lib/cuon-utils';
import { Matrix4 } from './lib/cuon-matrix';

const canvas = document.getElementById('canvas');

canvas.width = 300;
canvas.height = 300;

// 获取WebGL绘图上下文
const gl = getWebGLContext(canvas);
if (!gl) {
    alert('Failed to get the rendering context for WebGL');
}

// 着色器
// 顶点着色器程序
const VSHADER_SOURCE = `
    // 存储限定符
    attribute vec4 a_Position;
    void main() {
        // 设置坐标
        gl_Position = a_Position;
        // 设置尺寸
        // gl_PointSize = 10.0;
    }
`;

// 片元着色器
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        // 设置颜色
        gl_FragColor = u_FragColor;
    }
`;

// 初始化着色器
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders');
}

// 设置顶点位置
var n = initVertexBuffers(gl);
if (n < 0) {
    console.log('Failed to set the positions of the vertices');
}

// 设置顶点颜色
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 1, 1, 0, 1);

// 指定清空<canvas>的颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

/**
 * 清空<canvas>
 * 
 * @param buffer 指定待清空的缓冲区，位操作符可用来指定多个缓冲区
 * @param gl.COLOR_BUFFER_BIT 指定颜色缓冲
 * @param gl.DEPTH_BUFFER_BIT 指定深度缓冲区
 * @param gl.STENCIL_BUFFER_BIT 指定模板缓冲区
 */
gl.clear(gl.COLOR_BUFFER_BIT);

/**
 * 绘制一个点
 * 
 * @param mode 指定绘制的方式，可以接收以下常量符号
 * gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP,
 * gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN
 * 
 * @param first 指定从哪个顶点开始绘制（int）
 * @param count 指定绘制需要用到多少个顶点（int）
 */
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


/**
 * 1.创建顶点缓冲区对象
 * 2.将多个顶点的数据保存在缓冲区
 * 3.然后将缓冲区传给顶点着色器
 * 
 * @param {obj} gl 
 * @return {num} 返回绘制的顶点数量，如果发生错误，返回-1
 */
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, -0.5,
        0.5, -0.5, 
        -0.5, 0.5, 
        0.5, 0.5
    ]);
    var n = 3;

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 获取 a_Position 的位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给 a_Position 变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}