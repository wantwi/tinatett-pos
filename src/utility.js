export const moneyInTxt = (value, standard, dec = 2) => {
    var nf = new Intl.NumberFormat(standard, {
      minimumFractionDigits: dec,
      maximumFractionDigits: 2,
    })
    return nf.format(Number(value) ? value : 0.0)
  }

  
  export const isValidNumber = (input) => {
    var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);
    return p.test(input);
  }; 