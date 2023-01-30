const printVendorWiseLatency = (vendorDB) => {
    console.log('Vendors Database latency log: ');
    for (let vendor of vendorDB) {
        console.log(`${vendor.vendorName} : ${vendor.vendorLatency}ms`);
    }
}

const printLine = () => {
    console.log('-------------------------------------');
}

const printNewRequest = () => {
    console.log('\n\n\n#########################################################');
}
module.exports = { printVendorWiseLatency, printLine, printNewRequest }