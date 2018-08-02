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

### 自定义点的位置
 - 使用 `attribute` 变量
`attribute` 变量是一种 `GLSL ES` 变量，被用来从外部向顶点着色器内传输数据，只有顶点着色器能使用它。步骤：
   1. 在顶点着色器中，声明 `attribute` 变量；
   2. 将 `attribute` 变量赋值给 `gl_Position` 变量；
   3. 向 `attribute` 变量传输数据。
```
// 顶点着色器程序
const VSHADER_SOURCE = `
    // 存储限定符 类型 变量名
    attribute vec4 a_Position;
    void main() {
        // 设置坐标
        gl_Position = a_Position;
        // 设置尺寸
        gl_PointSize = 10.0;
    }
`;

/**
 * 获取attribute变量的存储位置
 * 
 * @param gl.program 程序对象,包括顶点着色器和片元着色器,执行initShaders后生成的
 * @param a_Position 为变量的名称
 * 
 * @return 存储地址 > 0
 */
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

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
```

### 自定义颜色
 ```
// 片元着色器
// 注册 u_FragColor 变量，声明类型
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        // 设置颜色
        gl_FragColor = u_FragColor;
    }
`;

/**
 * 获取u_FragColor变量的存储位置
 */
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

// 将点的颜色传输到u_FragColor变量中，rgba => (0, 0, 0, 1)
gl.uniform4f(u_FragColor, 0, 0, 0, 1);

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1);
 ```

### 通过鼠标点击绘制点，每个象限的有各自的颜色
 ```
// 注册鼠标点击事件响应函数
canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

// 鼠标点击位置数组
var g_points = [];

// 存储点颜色
var g_colors = [];

// 声明点击事件的处理函数
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
 ```

 ### 绘制多个点

 #### 使用缓冲区对象
 流程：先创建一个缓冲区，然后向其中写入顶点数据，一次性地向顶点着色器传入多个顶点的 attribute 变量的数据。
  - 创建缓冲区对象（gl.createBuffer()）。
  - 绑定缓冲区对象（gl.bindBuffer()）。
  - 将数据写入缓冲区对象（gl.bufferData()）。
  - 将缓冲区对象分配给一个 attribute 变量（gl.vertexAttribPointer()）。
  - 开启 attribute 变量（gl.enableVertexAttribArray()）。
```
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, 0.5, 0.5, -0.5
    ]);
    var n = 3;

    // 第一步
    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 第二步
    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 第三步
    // 将缓冲区对象分配给 a_Position 对象
    // 位置信息 2维数组 浮点类型
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 第四步
    // 连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 第五步 绘制

    return n;
}
```

#### 绘制模式
> gl.drawArrays(gl.POINTS, 0, n) 第一个参数

 - gl.POINTS 一系列点
 - gl.LINES 一系列单独的线条 (v0, v1), (v2, v3)
 - gl.LINES_STRIP 一系列连接的线段 (v0, v1), (v1, v2)
 - gl.LINES_LOOP 一系列连接的线段 (v0, v1), (v1, v2), (v2, v0)
 - gl.TRIANGLES 一系列单独的三角形 (v0, v1, v2), (v3, v4, v5)
 - gl.TRIANGLES 一系列带形状的三角形 (v0, v1, v2), (v2, v1, v3)

前三个点构成第一个三角形，从第二个点开始的三个点构成第二个三角形，与第一个三角形共一条边

 - gl.TRIANGLES 一系列三角形组成的类似与扇形的图形 (v0, v1, v2), (v0, v2, v3)

前三个点构成第一个三角形，接下来的一个点和前一个三角形的最后一调边组成接下来的一个三角形

#### 变换矩阵

```
x1   a b c   x
y1 = d e f * y
z1   g h i   z
 
分解得 =>

x1 = ax + by + cz;
y1 = dx + ey + fz;
z1 = gx + hy + iz;
```

##### 旋转矩阵

```
x1 = x*cosB - y*sinB;
y1 = x*sinB + y*cosB;
z1 = z;

与变换矩阵公式比较可得 => 

a = cosB; b = -sinB; c = 0;
d = sinb; e = cosB; c = 0;
g = 0;    h = 0;     i = 1;

得到旋转变换矩阵公式 => 

x1   cosB -sinB 0   x
y1 = sinB cosB 0 * y
z1   0    0     1   z

统一使用 4*4 矩阵可得 => 

x1   cosB -sinB 0 0   x
y1 = sinB cosB 0 0 * y
z1   0    0     1 0   z
1    0    0     0 1   1
```

##### 平移矩阵
> 由于 3x3 矩阵没有常量，所以增加至 4x4 矩阵，增加一个常量

```
// 变换矩阵
x1   a b c d   x
y1 = e f g h * y
z1   i j k l   z
1    m n o p   1

分解得 =>

x1 = ax + by + cz + d;
y1 = ex + fy + gz + h;
z1 = ix + jy + kz + l;
1  = mx + ny + oz + p;

// 平移方程式
x1 = x + Tx;
y1 = y + Ty;
z1 = z + Tz;

比较可得 =>

a = 1; b = 0; c = 0;
e = 0; f = 1; g = 0;
i = 0; j = 0; k = 1;
m = 0; n = 0; o = 0;
p = 1;

得到平移变换矩阵公式 =>

x1   1 0 0 Tx   x
y1 = 0 1 0 Ty * y
z1   0 0 1 Tz   z
1    0 0 0 1    1
```

##### 缩放矩阵

```
// 设 x,y,z 所放量分别为 Sx,Sy,Sz
x1 = Sx * x;
y1 = Sy * y;
z1 = Sz * z;

比较 4*4 变换公式可得 =>

x1   Sx 0 0 0   x
y1 = 0 Sy 0 0 * y
z1   0 0 Sz 0   z
1    0 0 0  1   1
```

#### 模型变换(模型矩阵)

 - 平移后旋转三角形

 ```
<"平移"后的坐标> = <平移矩阵> * <原始坐标>
<"平移后旋转"后的坐标> = <旋转矩阵> * <平移后的坐标>

带入可得 =>

<"平移后旋转"后的坐标> = <旋转矩阵> * (<平移矩阵> * <原始坐标>)

根据矩阵乘法法则可得 =>

<"平移后旋转"后的坐标> = (<旋转矩阵> * <平移矩阵>) * <原始坐标>

最后可先在 JavaScript 中计算 (<旋转矩阵> * <平移矩阵>)，再将得到的矩阵传入顶点着色器。
 ```

#### 动画 - 基础
> 不断的擦除和重绘三角形。

 - 机制一：在不同时刻反复调用同一个函数绘制三角形。
 - 机制二：每次绘制之前，清除上次的内容，并使三角形旋转相应角度。

```
// 定义旋转速度（度/秒）
var ANGLE_STEP = 45.0;

// 记录三角形当前的旋转速度
var currentAngle = 0.0;

// 记录三角形更新角度的时间(animate执行时的)
var g_last = Date.now();

// 创建模型矩阵
var modelMatrix = new Matrix4();

// 开始绘制三角形
// 1.更新角度 2.绘制 3.重复
var tick = function() {
    // 更新旋转角度
    currentAngle = animate(currentAngle);
    // 绘制
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    // 请求浏览器调用 tick
    // 这里不用 interval 的原因是 interval 在浏览器当前标签未激活时也执行
    // 而 requrestAnimationFrame 只有浏览器当前标签激活才执行
    requestAnimationFrame(tick);
}
tick();

// 更新旋转角度
function animate(angle) {
    // 计算距离上次调用经过了多久
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // 根据距离上次调用的时间，计算旋转角度
    var newAngle = angule + (ANGULE_STEP * elapsed)/1000;
    // 转换为一周内
    return newAngle %= 360;
}

// 绘制
// 1.设置旋转矩阵 2.将旋转矩阵传入着色器 3.清理画板 4.绘制
// 平移 + 缩放 + 旋转 => 模型矩阵 => 旋转 * 缩放 * 平移
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix){
    // 设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.scale(0.5, 0.5, 0.5);
    modelMatrix.translate(0.35, 0, 0);
    
    // 传入着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    // 清理画板
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
```

#### 创建多个缓冲区对象
> 使用多个缓冲区对象向着色器传递多种数据，比较适合数量不大的情况。当程序中的复杂三维图具有成千上万顶点时，维护所有的顶点是很困难的。WebGL 允许我们把顶点的坐标和尺寸数据打包到同一缓冲区对象中，并通过某种机制分别访问缓冲区对象中不同种类的数据。
```
// 顶点着色器
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

// 顶点坐标与尺寸集合
var verticesSizes = new Float32Array([
    0.0, 0.5, 10.0,     // 第一个点
    -0.5, -0.5, 20.0,   // 第二个点
    0.5, -0.5, 30.0     // 第三个点
]);

// 创建缓冲区对象
var vertexSizeBuffer = gl.createBuffer();

// 将顶点坐标与尺寸写入缓冲区并开启
gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

// 获取数据每个单位的大小
var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

// 获取 a_Position 的存储位置，分配缓冲区并开启
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
// 这里的 a_Position 是每隔三个数据，取 0 - 2(不包含index = 2) 的数据
// 2 为每组数据大小
// FSIZE * 3 为每隔三个数据为一组
// 0 为从数据 index = 0 开始算
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
gl.enableVertexAttribArray(a_Position);

// a_PointSize 与 a_Position 分配类似
var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
// 这里的 a_PointSize 是每个三个数据，取 2 的数据
gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
gl.enableVertexAttribArray(a_PointSize);
```

#### 修改颜色(varying 变量)
> `uniform` 变量是“一致的”，而不是“可变的(`varying`)”，不能为每一个顶点准备一个值，所以所有的点都是同一个颜色。`varying` 变量的作用是从顶点着色器向片元着色器传输数据。
```
// 顶点着色器
const VSHADER_SOURCE = `
    // 存储限定符
    attribute vec4 a_Position;

    // 声明传入的 JavaScript 变量
    attribute vec4 a_Color;

    // 声明 varying 变量，传递给片元着色器
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

// 顶点坐标与颜色集合
var verticesColors = new Float32Array([
    0, 0.5, 1.0, 0.0, 0.0, 
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0
]);

// ...
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

// ...
var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
```

