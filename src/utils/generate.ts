/**
 * @description 生成头像
 * @param name 名称
 * @param opts 选项
 * @returns 头像
 */
export const generateAvatar = (
  name: string,
  opts: {
    size?: number;
    bgColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontWeight?: string;
  } = {},
) => {
  const {
    size = 64,
    bgColor = '#E6F4FF',
    textColor = '#1677FF',
    fontFamily = 'PingFang SC, sans-serif',
    fontWeight = '400',
  } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const trimmed = (name || '').trim();
  let char = '?';
  if (trimmed.length === 0) {
    char = '?';
  } else {
    const first = trimmed.charAt(0);
    if (/[\u4e00-\u9fff]/.test(first)) {
      char = first;
    } else {
      const m = trimmed.match(/[A-Za-z0-9]/);
      char = m ? m[0].toUpperCase() : trimmed.charAt(0).toUpperCase();
    }
  }

  const fontSize = Math.floor(size * 0.5);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  ctx.fillText(char, size / 2, size / 2);

  return canvas.toDataURL('image/png');
};

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}
