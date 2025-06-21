
const Midtrans = require('midtrans-client');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Inisialisasi Core API dan Snap API Midtrans
const coreApi = new Midtrans.CoreApi({
    isProduction: isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const snap = new Midtrans.Snap({
    isProduction: isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});


module.exports = {
    coreApi,
    snap,

};
