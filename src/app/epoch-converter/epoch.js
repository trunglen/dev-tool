Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(),0,1);
    var jul = new Date(this.getFullYear(),6,1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.printLocalTimezone = function() {
    if (typeof moment !== "undefined") {
        var md = moment(this);
        return "GMT" + md.format("Z");
    }
    return '';
}
Date.prototype.epochConverterLocaleString = function(disabletz) {
    disabletz = disabletz || false;
    var locale = getLocale();
    if (typeof moment === "undefined") {
        return this.toDateString() + " " + this.toTimeString();
    }
    moment.locale(locale);
    var md = moment(this);
    if (!md.isValid()) {
        return 'Invalid input.';
    }
    var currentLocaleData = moment.localeData();
    var myLocaleData = moment.localeData(locale);
    var myFormat = myLocaleData.longDateFormat('LLLL');
    if (md.format("SSS") != '000') {
        myFormat = myFormat.replace(":mm", ":mm:ss.SSS");
        myFormat = myFormat.replace(".mm", ".mm.ss.SSS");
    } else {
        myFormat = myFormat.replace(":mm", ":mm:ss");
        myFormat = myFormat.replace(".mm", ".mm.ss");
    }
    if (!disabletz) {
        myFormat += " [GMT]Z";
    }
    var customDate = md.format(myFormat);
    return customDate;
}
Date.prototype.epochConverterGMTString = function() {
    var locale = getLocale();
    if (typeof moment === "undefined") {
        return this.toUTCString();
    }
    moment.locale('en');
    var md = moment(this);
    if (!md.isValid()) {
        return 'Invalid input.';
    }
    var myLocaleData = moment.localeData(locale);
    var myFormat = myLocaleData.longDateFormat('LLLL').replace(/\[([^\]]*)\]/g, " ");
    if (md.format("SSS") != '000') {
        myFormat = myFormat.replace(":mm", ":mm:ss.SSS");
    } else {
        myFormat = myFormat.replace(":mm", ":mm:ss");
    }
    return md.utc().format(myFormat);
}
function getLocale() {
    var locale = getQueryParams('locale');
    var al = [];
    if (typeof moment !== undefined) {
        al = moment.locales();
    }
    if (locale && al.indexOf(locale) > -1)
        return locale;
    return window.navigator.userLanguage || window.navigator.language || "en";
}