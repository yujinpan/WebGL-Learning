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
    attribute float a_PointSize;
    void main() {
        // 设置坐标
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
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

// 指定清空<canvas>的颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 设置顶点颜色
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 1, 1, 0, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, n);

/**
 * 1.创建顶点缓冲区对象
 * 2.将多个顶点的数据保存在缓冲区
 * 3.然后将缓冲区传给顶点着色器
 * 
 * @param {obj} gl 
 * @return {num} 返回绘制的顶点数量，如果发生错误，返回-1
 */
function initVertexBuffers(gl) {
    var verticesSizes = new Float32Array([
        0, 0.5, 10.0, 
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    var n = 3;

    // 创建缓冲区对象
    var vertexSizeBuffer = gl.createBuffer();
    if (!vertexSizeBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    // 获取每个数据内存大小
    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    // 获取 a_Position 的位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给 a_Position 变量
    // location,size,type,normalize,stride,offset
    // 每隔 3 个，取从 0 开始前面 2 个数据
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

    // 连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 获取 a_PointSize 的变量位置
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    // 将缓冲区对象分配给 a_PointSize 变量
    // 每隔 3 个，取从 2 开始的 1 个数据
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);

    // 连接 a_PointSize 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}