export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(price);
};

export const calculateSavings = (original: number, sale: number) => {
  return original - sale;
};
