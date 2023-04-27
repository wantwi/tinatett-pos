export const moneyInTxt = (value, standard, dec = 2) => {
    var nf = new Intl.NumberFormat(standard, {
      minimumFractionDigits: dec,
      maximumFractionDigits: 2,
    })
    return nf.format(Number(value) ? value : 0.0)
  }

  
