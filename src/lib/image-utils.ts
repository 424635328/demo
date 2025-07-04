// lib/image-utils.ts

/**
 * 将图片文件裁剪为指定尺寸的方形 Blob 对象。
 * 采用“居中裁剪”策略，类似于 CSS 的 `background-size: cover`。
 * 
 * @param file 图片文件对象
 * @param outputSize 最终输出的正方形图片的边长（像素）
 * @returns 返回一个包含裁剪后图片数据的 Promise<Blob>
 */
export function cropImageToSquare(file: File, outputSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // 1. 验证文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image.'));
      return;
    }

    const image = new Image();
    const url = URL.createObjectURL(file);
    image.src = url;

    image.onload = () => {
      // 释放临时对象 URL
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context.'));
        return;
      }

      // 2. 计算居中裁剪参数
      const { width: originalWidth, height: originalHeight } = image;
      const originalRatio = originalWidth / originalHeight;

      let sourceX = 0, sourceY = 0;
      let sourceWidth = originalWidth, sourceHeight = originalHeight;

      if (originalRatio > 1) { // 横向图片
        sourceWidth = originalHeight;
        sourceX = (originalWidth - originalHeight) / 2;
      } else { // 纵向或方形图片
        sourceHeight = originalWidth;
        sourceY = (originalHeight - originalWidth) / 2;
      }

      // 3. 将图片裁剪后绘制到 canvas
      ctx.drawImage(
        image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputSize, outputSize
      );

      // 4. 从 canvas 获取 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed.'));
          }
        },
        'image/png', // 推荐使用 png 以支持透明度，或 jpeg 以获得更好压缩
        0.95 // 图片质量
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image failed to load.'));
    };
  });
}