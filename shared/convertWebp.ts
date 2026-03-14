const canvasConvert = (source: File | Blob, useObjectUrl = false): Promise<Blob | undefined> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');

    const render = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      canvas.width = 512;
      canvas.height = 512;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const width = img.width * scale;
      const height = img.height * scale;

      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      ctx.drawImage(img, x, y, width, height);

      canvas.toBlob(
        (webpBlob) => {
          if (webpBlob && webpBlob.type === 'image/webp') {
            resolve(webpBlob);
            return;
          }
          // WebP 미지원 또는 실패 시 JPEG fallback
          canvas.toBlob(
            (jpegBlob) => {
              if (!jpegBlob) {
                reject(new Error('Failed to create image Blob'));
                return;
              }
              resolve(jpegBlob);
            },
            'image/jpeg',
            0.85
          );
        },
        'image/webp',
        0.8
      );
    };

    img.onload = render;
    img.onerror = () => reject(new Error('Failed to load image'));

    if (useObjectUrl) {
      img.src = URL.createObjectURL(source);
    } else {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      fileReader.onerror = () => reject(new Error('Failed to read file'));
      fileReader.readAsDataURL(source);
    }
  });
};

export const convertToWebP = async (image: File): Promise<Blob | undefined> => {
  const isHeic =
    image.type === 'image/heic' ||
    image.type === 'image/heif' ||
    image.name.toLowerCase().endsWith('.heic') ||
    image.name.toLowerCase().endsWith('.heif');

  // HEIC: ObjectURL로 브라우저 네이티브 디코딩 시도 (iOS 지원)
  if (isHeic) {
    try {
      return await canvasConvert(image, true);
    } catch {
      // 네이티브 디코딩 실패 시 heic2any fallback (데스크톱)
      try {
        const heic2any = (await import('heic2any')).default;
        const jpegBlob = await heic2any({ blob: image, toType: 'image/jpeg', quality: 0.85 });
        const blob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
        return await canvasConvert(blob, true);
      } catch (error) {
        console.error('HEIC 변환 실패:', error);
        throw new Error('HEIC 파일을 변환할 수 없습니다. JPEG 또는 PNG로 변환 후 업로드해주세요.');
      }
    }
  }

  // 일반 이미지: 기존 방식
  return canvasConvert(image);
};
