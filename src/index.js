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
        gl_PointSize = 10.0;
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

/**
 * 获取attribute变量的存储位置
 * 
 * @param gl.program 程序对象,包括顶点着色器和片元着色器,执行initShaders后生成的
 * @param a_Position 为变量的名称
 * 
 * @return 存储地址 > 0
 */
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
}

/**
 * 获取u_FragColor变量的存储位置
 */
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
if (!u_FragColor) {
    conso.log('Failed to get u_FragColor variable');
}


// 注册鼠标点击事件响应函数
canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

/**
 * 将顶点位置传输给attribute变量
 * 
 * @description
 * 将数据传输给location参数指定的attribute变量。
 * gl.vertexAttrib1f()仅传输一个值，这个值将被填充到attribute变量的第1个分量中，
 * 第2、3个分量将被设定为0.0，第4个分量将被设定为1.0。
 * 
 * @example
 * gl.vertexAttrib1f(location, v0)
 * gl.vertexAttrib2f(location, v0, v1)
 * gl.vertexAttrib3f(location, v0, v1, v2)
 * gl.vertexAttrib4f(location, v0, v1, v2, v3)
 * 
 * @param location 指定attribute变量的存储位置
 * @param v0,v1,v2,v3 指定传输给attribute变量的四个分量的值
 */
gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);


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

// 鼠标点击位置数组
var g_points = [];

// 存储点颜色
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    // 鼠标点击的x,y坐标
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = ((canvas.width / 2) - (y - rect.top)) / (canvas.width / 2);
    // 将坐标存储到g_points数组中
    if (x >= 0.0 && y >= 0.0) {
        // 第一象限 红色
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
        // 第三象限 绿色
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
        // 第二，第四象限 白色
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }
    g_points.push([x, y]);

    // 清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        // 将点的位置传递到变量中a_Position
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // 将点的颜色传输到u_FragColor变量中
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

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
gl.drawArrays(gl.POINTS, 0, 1);