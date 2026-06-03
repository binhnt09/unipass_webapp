export const getConditionLabel = (cond: string | null | undefined): string => {
  if (!cond) return 'Như mới (95-99%)';
  const upper = cond.toUpperCase().replace(/\s+/g, '_');
  switch (upper) {
    case 'NEW':
    case 'BRAND_NEW':
      return 'Mới nguyên hộp';
    case 'LIKE_NEW':
      return 'Như mới (95-99%)';
    case 'EXCELLENT':
      return 'Rất tốt (90-95%)';
    case 'GOOD':
      return 'Tốt (80-90%)';
    case 'FAIR':
      return 'Đã qua sử dụng, còn dùng tốt';
    default:
      return cond;
  }
};
