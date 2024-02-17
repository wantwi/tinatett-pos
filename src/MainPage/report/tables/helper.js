export function getCurrentDateInWords(date) {
    const currentDate = new Date(date);

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'short' }); // Use 'short' option for short month names
    const year = currentDate.getFullYear();

    const dateInWords = `${day}-${month}-${year}`;

    return dateInWords;
}