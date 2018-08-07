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
    attribute vec4 a_Color;
    // varying 变量
    varying vec4 v_Color;
    void main() {
        // 设置坐标
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        // 将数据传给片元着色器
        v_Color = a_Color;
    }
`;

// 片元着色器
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        // 从顶点着色器接收数据
        gl_FragColor = v_Color;
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
    var verticesColors = new Float32Array([
        0, 0.5, 1.0, 0.0, 0.0, 
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
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
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    // 获取每个数据内存大小
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // 获取 a_Position 的位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给 a_Position 变量
    // location,size,type,normalize,stride,offset
    // 每隔 5 个，取从 0 开始前面 2 个数据
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

    // 连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 获取 a_Color 的变量位置
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    // 将缓冲区对象分配给 a_Color 变量
    // 每隔 5 个，取从 2 开始的 3 个数据
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);

    // 连接 a_Color 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    return n;
}