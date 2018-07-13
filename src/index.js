import { WebGLUtils } from './lib/webgl-utils';
import { WebGLDebugUtils } from './lib/webgl-debug';
import { initShaders, createProgram, loadShader, getWebGLContext } from './lib/cuon-utils';
import { Matrix4 } from './lib/cuon-matrix';

console.log(WebGLUtils);

const canvas = document.getElementById('canvas');

canvas.width = 300;
canvas.height = 150;

// 获取WebGL绘图上下文
const gl = getWebGLContext(canvas);
if (!gl) {
    alert('Failed to get the rendering context for WebGL');
}

// 指定清空<canvas>的颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 清空<canvas>
gl.clear(gl.COLOR_BUFFER_BIT);