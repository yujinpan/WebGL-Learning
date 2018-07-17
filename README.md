# Web Graphics Library Learning

## 开始

 - 使用 `webpack + es6` 开发环境
 - 将书中用到的库都用es6封装

## 目录

### 最短的WebGL程序：清空绘图区
 - 实现流程 = 获取canvas -> 获取WebGL的context -> 设置初始化颜色 -> 清空canvas
 ```
// 获取canvas，设置canvas宽高
const canvas = document.getElementById('canvas');
canvas.width = 300;
canvas.height = 300;

// 获取WebGL的绘图上下文
const gl = getWebGLContext(canvas);

// 配置清空<canvas>的颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 执行清空
gl.clear(gl.COLOR_BUFFER_BIT);
 ```

 ### 绘制一个点

 - **顶点着色器(Vertex shader):** 顶点着色器是用来描述顶点特性（如位置，颜色）的程序。**顶点(vertex)**是指二维或三维空间中的一个点，比如二维或三维图形的端点或交点。
 ```
// Vertex shader program
const VSHADER_SOURCE = `
    void main() {
        // 顶点位置
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        // 顶点尺寸
        gl_PointSize = 10.0;
    }
`
 ```

 - **片元着色器(Fragment shader)**: 进行逐片元处理过程如光照的程序。**片元(fragment)**是WebGL术语，可以理解为像素。
  ```
// Fragment shader program
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`
  ```
 - 实现流程 = 获取canvas -> 获取WebGL的context -> **初始化着色器** -> 设置初始化颜色 -> 清空canvas -> **绘制点**
 ```
...
// Get the rendering context for WebGL
var gl = getWebGLContext(canvas);

// init shaders
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

// 配置初始化颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
...

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1);
 ```

### 绘制一个点（使用变量版本）
