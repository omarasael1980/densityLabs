const DateFormater = (date) => {
    const dateDate = new Date(date);
    const dateFormated = dateDate.toLocaleDateString();
    return dateFormated;
};

export default DateFormater;
