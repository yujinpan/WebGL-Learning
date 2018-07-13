import './base.css';

import matIV from './module/minMatrix';
import createShader from './module/create_shader';
import createProgram from './module/create_program';
import createVbo from './module/create_vbo';

// canvas元素
const canvas = document.getElementById('canvas');

// 获取context
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// 定义canvas的宽高
canvas.width = 500;
canvas.height = 300;

// 设定初始化颜色，深度
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clearDepth(1.0);

// 执行初始化
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


// 生成顶点/片段着色器
var v_shader = createShader(gl, 'vs');
var f_shader = createShader(gl, 'fs');

// 程序对象的生成与连接
var prg = createProgram(gl, v_shader, f_shader);

// attributeLocation的获取，第几个attribute变量
var attLocation = gl.getAttribLocation(prg, 'position');

// attribute的元素数量x,y,z，这个变量有几个元素组成
var attStride = 3;


// 顶点数据
var vertex_position = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0, 
    -1.0, 0.0, 0.0,
];

// 生成VBO
var vbo = createVbo(gl, vertex_position);

// 绑定VBO
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

// 设定attribute属性
gl.enableVertexAttribArray(attLocation);

// 添加attribute属性
gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0); 


// 生成matIV对象
const m = new matIV();

// 模型
var mMatrix = m.identity(m.create());
// 视图
var vMatrix = m.identity(m.create());
// 投影
var pMatrix = m.identity(m.create());
// 最终的mvp
var mvpMatrix = m.identity(m.create());

// 视图矩阵
m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

// 投影矩阵
m.perspective(90, canvas.width/canvas.height, 0.1, 100, pMatrix);

// 相乘，得到最终的矩阵
m.multiply(pMatrix, vMatrix, mvpMatrix);
m.multiply(mvpMatrix, mMatrix, mvpMatrix);

console.log(mvpMatrix);

// uniformLocation的获取
var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

// 向uniformLocation中传入坐标变换矩阵
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

// 绘制模型
gl.drawArrays(gl.TRIANGLES, 0, 3);

// context的刷新
gl.flush();
