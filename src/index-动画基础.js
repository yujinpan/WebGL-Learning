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
    uniform mat4 u_ModelMatrix;
    void main() {
        // 设置坐标
        gl_Position = u_ModelMatrix * a_Position;
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

// 旋转速度（度/秒）
var ANGLE_STEP = 45.0;

// 指定清空<canvas>的颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 获取 u_ModelMatrix 变量的存储位置
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

// g_last: 记录上一次调用 animate 函数的时刻
var g_last = Date.now();
// 三角形的当前旋转角度
var currentAngle = 0.0;
// 模型矩阵
var modelMatrix = new Matrix4();

// 开始绘制三角形
var tick = function() {
    // 更新旋转角
    currentAngle = animate(currentAngle);
    // 绘制三角形
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    // 请求浏览器调用 tick
    requestAnimationFrame(tick);
};
tick();

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
        0, 0.5, 
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var n = 3;

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
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

/**
 * 绘制三角形
 * 1.设置旋转矩阵
 * 2.将矩阵传入着色器
 * 3.清理画板
 * 4.绘制
 */
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置平移 + 缩放 + 旋转矩阵
    // 模型变换中顺序为 旋转 * 平移 * 缩放
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.scale(0.5, 0.5, 0.5);
    modelMatrix.translate(0.5, 0, 0);

    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 获取旋转角度
 * g_last: 记录上一次调用函数的时刻
 */
function animate(angle) {
    // 计算距离上次调用经过多久的时间
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // 根据上次调用的时间，更新当前旋转角度
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}