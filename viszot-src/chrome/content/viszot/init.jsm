var EXPORTED_SYMBOLS = ["heyMsg"];
let heyMsg = 0;
const printHello = () => {
    heyMsg++;
    return heyMsg;
};
heyMsg = printHello();
//alert(printHello());