'use strict';

app.filter('timeLeft', function () {
    return function (str) {
        console.log("Calculating time until " + str);
        return moment(str, 'dddd DD MMM, h:mm A').fromNow();
    };
});

app.filter('formatTime', function () {
    return function (str) {
        return moment(str).format('dddd DD MMM, h:mm A');
    };
});

app.filter('formatTimeShort', function () {
   return function (str) {
        return moment(str).format('DD/MM h:mmA');
    };
});
app.filter('dateFromNow', function () {
    return function (unformattedDate, emptyStrText) {
        var formattedDate = moment.unix(unformattedDate).fromNow();
        if (formattedDate === "" && emptyStrText) {
            formattedDate = emptyStrText;
        }
        return formattedDate;
    };
});
app.filter('commaThousands', function () {
    return function (inputNumber) {
        var formattedNumber = "0";
        if (inputNumber) {
            formattedNumber = inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return formattedNumber;
    };
});
app.filter('capitaliseFirstLetter', function () {
    return function (inputString, emptyStrText) {
        if (inputString) {
            var formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
            if (formattedString === "" && emptyStrText) {
                formattedString = emptyStrText;
            }

            return formattedString;
        }
        else {
            return "";
        }
    };
});