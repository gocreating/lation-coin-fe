export const formatUSD = (amount) => {
  return amount.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatTWD = (amount) => {
  return amount.toLocaleString('zh', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
