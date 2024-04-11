/*
和包 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#和包
0 0 1,5 * * * , tag=和包, img-url=, enabled=true

================Loon==============
[Script]
cron "0 0 1,5 * * *" script-path=,tag=和包

===============Surge=================
和包 = type=cron,cronexp="0 0 1,5 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
和包 = type=cron,script-path=, cronexpr="0 0 1,5 * * *", timeout=33600, enable=true
*/

const $ = new Env('和包');
$.log(`需要新建环境变量: Hb_list\n填写抓包 post请求https://mca.cmpay.com/security/login/simplify/refresh-token 请求params\n多用户可以用"#" "@" "\\n" 隔开`);

window = {};

var appUrlArr = [],
    x_user_id = "",
    x_user_no = "",
    x_app_deviceid = "",
    x_auth_token = "",
    user_agent = "",
    refresh_token_params = "",
    ssoData = [],
    ssoData1 = "",
    ssoData2 = "",
    ssoToken = "",
    Cookie = "";

const CryptoJS = require("crypto-js"),
    JSEncrypt = require('jsencrypt'),
    aeskey = "4decVlBZeBb7lUgU1T5A0e3JDdWk3p2n",
    aesiv = "LVn9gsTJzsaBl3Ur",
    crypto = require('crypto');

!(async () => {
    //检查环境变量
    $.log(`开始检测环境变量`);
    if (!(await checkEnv())) {
        return;
    } else {
        //获取用户信息
        await initAccountInfo();
    }
})().catch((e) => $.logErr(e)).finally(() => $.done());

async function checkEnv() {
    const Hb_list = ($.isNode() ? (process.env.Hb_list) : ($.getval('Hb_list'))) || "";
    if (!Hb_list) {
        let str = Hb_list ? "" : "Hb_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Hb_list.indexOf('#') != -1) {
        appUrlArrs = Hb_list.split('#');
        $.log(`您选择的是用"#"隔开 Hb_list\n`);
    } else if (Hb_list.indexOf('\n') != -1) {
        appUrlArrs = Hb_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Hb_list\n`);
    } else if (Hb_list.indexOf('@') != -1) {
        appUrlArrs = Hb_list.split('@');
        $.log(`您选择的是用"@"隔开 Hb_list\n`);
    } else {
        appUrlArrs = [Hb_list];
    }
    Object.keys(appUrlArrs).forEach((item) => {
        if (appUrlArrs[item]) {
            appUrlArr.push(appUrlArrs[item]);
        }
    });
    totalUser = appUrlArr.length;
    $.log(`共找到${totalUser}个用户`);
    return true;
}

async function getEnvParam(userNum) {
    let appUrlArrVal = appUrlArr[userNum];
    refresh_token_params = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        let refresh_token_params_json = JSON.parse(await decrypt(`${refresh_token_params}`, aeskey, aesiv));
        user_agent = refresh_token_params_json.userAgent;
        x_app_deviceid = (refresh_token_params_json.random).substr(0, 32);
        const {
            publicKey,
            privateKey
        } = await generateRSAKeyPair();
        x_auth_token = null;
        await simplify_refresh_token(publicKey);
        await $.wait(1000); //等待1秒
        if (x_auth_token) {
            await sso_information(privateKey);
            await $.wait(1000); //等待1秒
            ssoToken = ssoData[await random(0, ssoData.length - 1)];
            await signAwardPoint_takeNumberLogin();
            await $.wait(1000); //等待1秒
            await signAwardPoint_sign();
            await $.wait(1000); //等待1秒
            ssoToken = ssoData[await random(0, ssoData.length - 1)];
            await largeTurntable_activityInitEntry();
            await $.wait(1000); //等待1秒
            await login_common_initialization();
            await $.wait(1000); //等待1秒
            await login_common_ssoTokenLogin();
            await $.wait(1000); //等待1秒
            await lucky_loginCheck();
            await $.wait(1000); //等待1秒
            await maktcfgh5_bigTurn();
            await $.wait(1000); //等待1秒
            await largeTurntable_activityInitEntry2();
            await $.wait(1000); //等待1秒
            await largeTurntable_decimationIntegral();
            await $.wait(1000); //等待1秒
            ssoToken = ssoData[await random(0, ssoData.length - 1)];
            await signAwardPoint_takeNumberLogin();
            await $.wait(1000); //等待1秒
            await signAwardPoint_getUserPoint();
            await $.wait(1000); //等待1秒
        }
    }
}

function object2str(t) {
    var a = [];
    for (var b in t) a.push(b + "=" + t[b]);
    return a.join("&");
}

function object2query3(t) {
    var a = [];
    for (var b in t) a.push(b);
    a.sort();
    var c = [];
    for (var d in a) c.push(a[d] + "=" + t[a[d]]);
    return c.join("");
}

async function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function generateRSAKeyPair() {
    const {
        publicKey,
        privateKey
    } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // RSA 模数的位数
        publicKeyEncoding: {
            type: 'spki', // 公钥的格式
            format: 'pem' // 输出 PEM 格式
        },
        privateKeyEncoding: {
            type: 'pkcs8', // 私钥的格式
            format: 'pem' // 输出 PEM 格式
        }
    });
    return {
        publicKey,
        privateKey
    };
}

async function encrypt(data, keyStr, IvStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(IvStr);
    return CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
}

async function decrypt(data, keyStr, IvStr) {
    var data_hex = CryptoJS.enc.Hex.parse(data);
    var data_base64 = CryptoJS.enc.Base64.stringify(data_hex);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(IvStr);
    return CryptoJS.AES.decrypt(data_base64, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}

async function RSA_encode(RSAKEY, str) {
    const rsaEncrypt = new JSEncrypt();
    rsaEncrypt.setPublicKey(RSAKEY);
    return rsaEncrypt.encrypt(str);
}

async function RSA_decode(RSAKEY, str) {
    const rsaEncrypt = new JSEncrypt();
    rsaEncrypt.setPrivateKey(RSAKEY);
    return rsaEncrypt.decrypt(str);
}

async function RSA_encode_sign(RSAKEY, str) {
    const rsaEncrypt = new JSEncrypt();
    rsaEncrypt.setPrivateKey(RSAKEY);
    return rsaEncrypt.sign(str, CryptoJS.MD5, 'md5');
}

function h(t) {
    if (t.indexOf("=") != 1) {
        t = str_json(t);
    }
    return Object.keys(t).sort().map((function(e) {
        return "".concat(e, "=").concat(t[e])
    })).join("&");

}

function str_json(str) {
    const keyValuePairs = str.split('&');
    const jsonObject = {};
    keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('=');
        jsonObject[key] = value;
    });
    return jsonObject;
}

function get_sign(method, x) {
    return method == "get" ? CryptoJS.MD5("".concat(h(x)).concat("w8xYidyt2DjT3dLV")).toString() : CryptoJS.MD5("".concat(JSON.stringify(x)).concat("w8xYidyt2DjT3dLV")).toString();
}

//登录refresh-token
async function simplify_refresh_token(publicKey) {
    let refresh_token_params_json = JSON.parse(await decrypt(`${refresh_token_params}`, aeskey, aesiv));
    refresh_token_params_json.key = publicKey.replace(/-----BEGIN PUBLIC KEY-----/g, "").replace(/-----END PUBLIC KEY-----/g, "").replace(/\n/g, "").trim();
    refresh_token_params_json.timestamp = Date.now();
    let x_lemon_sign = CryptoJS.MD5(JSON.stringify(refresh_token_params_json) + aeskey).toString();
    let refresh_token_data = (await encrypt(JSON.stringify(refresh_token_params_json), aeskey, aesiv)).toUpperCase();
    return new Promise((resolve) => {
        let url = {
            url: `https://mca.cmpay.com/security/login/simplify/refresh-token`,
            body: `${refresh_token_data}`,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "x-lemon-sign": x_lemon_sign,
                "x-app-ver": "9.17.30",
                "user-agent": `${user_agent}`,
                "x-app-city": "230",
                "x-user-id": ``,
                "x-auth-token": "NO_MOCAM_SESSION",
                "x-user-no": ``,
                "x-app-deviceid": `${x_app_deviceid}`,
                "x-app-id": "HANGYAN06",
                "x-app-platform": "3",
                "x-lemon-secure": "HANGYAN06",
                "x-app-province": "31",
                "x-app-osver": "Android 10",
                "x-app-channel": "",
                "cache-control": "no-cache"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录refresh-token Api请求失败`);
                } else {
                    let data2 = JSON.parse(await decrypt(data, aeskey, aesiv));
                    if (data2.msgCd == "MCA00000") {
                        let refreshToken = data2.body.refreshToken;
                        if (refresh_token_params_json.refreshToken != refreshToken) {
                            refresh_token_params_json.refreshToken = refreshToken;
                            refresh_token_data = (await encrypt(JSON.stringify(refresh_token_params_json), aeskey, aesiv)).toUpperCase();
                            let str = ($.isNode() ? (process.env.Hb_list) : ($.getval('Hb_list'))) || "";
                            let str2 = str.replace(refresh_token_params, refresh_token_data);

                        }
                        x_auth_token = data2.body.sessionId;
                        x_user_no = data2.body.userNo;
                    } else {
                        $.log(`登录refresh-token ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取ssoToken
async function sso_information(privateKey) {
    let sso_information_random = await random(100000000, 999999999);
    let x_lemon_sign = await RSA_encode_sign(privateKey, `random=${sso_information_random}`);
    return new Promise((resolve) => {
        let url = {
            url: `https://mca.cmpay.com/mca/base/v2/sso/information?random=${sso_information_random}`,
            headers: {
                "x-lemon-sign": x_lemon_sign,
                "x-app-ver": "9.17.30",
                "user-agent": `${user_agent}`,
                "x-app-city": "230",
                "x-auth-token": `${x_auth_token}`,
                "x-user-no": `${x_user_no}`,
                "x-app-deviceid": `${x_app_deviceid}`,
                "x-app-id": "HANGYAN06",
                "x-app-platform": "3",
                "x-lemon-secure": "HANGYAN06",
                "x-app-province": "31",
                "x-app-osver": "Android 10",
                "x-app-channel": "",
                "cache-control": "no-cache"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取ssoToken Api请求失败`);
                } else {
                    if (data.indexOf(",") != -1) {
                        let data_0 = data.split(',')[0];
                        let aeskey_str = await RSA_decode(privateKey, data_0);
                        let aeskey_x = aeskey_str.split(",")[0];
                        let aesiv_x = aeskey_str.split(",")[1];
                        let data_1 = data.split(',')[1];
                        let data2 = JSON.parse(await decrypt(data_1, aeskey_x, aesiv_x));
                        if (data2.msgCd == "MCA00000") {
                            ssoData = data2.body.ssoData;
                            ssoData1 = data2.body.ssoData1;
                            ssoData2 = data2.body.ssoData2;
                        } else {
                            $.log(`获取ssoToken ${data2.msgInfo}`);
                        }
                    } else {
                        $.log(`获取ssoToken ${JSON.parse(data2).msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取Cookie_signAwardPoint/takeNumberLogin
async function signAwardPoint_takeNumberLogin() {
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/signAwardPoint/takeNumberLogin?${ssoToken}&APPNO=&ydrzToken=`,
            headers: {
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "Referer": `https://ump.cmpay.com/info/version3/marketing_2022/signin/signin.html?utm_source=QD%26utm_medium=FF%26utm_term=45%26utm_content=hbkhd%26utm_campaign=QDLJF%26_channel_track_key=2msSrOXu&${ssoData1}&${ssoToken}`,
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取Cookie_signAwardPoint/takeNumberLogin Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let s3 = "";
                        for (let i in resp.headers['set-cookie']) {
                            let s2 = resp.headers['set-cookie'][i];
                            s3 += s2.substring(0, s2.indexOf(";") + 2);
                        }
                        Cookie = s3.substr(0, s3.indexOf(";"));
                    } else {
                        $.log(`获取Cookie_signAwardPoint/takeNumberLogin ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//签到
async function signAwardPoint_sign() {
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/signAwardPoint/sign`,
            body: JSON.stringify({
                "isClient": "0",
                "opDfp": ""
            }),
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "Content-Type": "application/json",
                "Origin": "https://ump.cmpay.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/info/version3/marketing_2022/signin/signin.html?utm_source=QD%26utm_medium=FF%26utm_term=45%26utm_content=hbkhd%26utm_campaign=QDLJF%26_channel_track_key=2msSrOXu&${ssoData1}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let signAmtCnt = data2.body.signAmtCnt;
                        $.log(`签到 获得${signAmtCnt}积分`);
                    } else {
                        $.log(`签到 ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取Cookie_largeTurntable/activityInitEntry
async function largeTurntable_activityInitEntry() {
    let largeTurntable_activityInitEntry_data = `jrnNo=ACT3529&usrId=&random=${await random(10000,99999)}`;
    let x_lemon_sign = get_sign("get", largeTurntable_activityInitEntry_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/largeTurntable/activityInitEntry?${largeTurntable_activityInitEntry_data}`,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取Cookie_largeTurntable/activityInitEntry Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let s3 = "";
                        for (let i in resp.headers['set-cookie']) {
                            let s2 = resp.headers['set-cookie'][i];
                            s3 += s2.substring(0, s2.indexOf(";") + 2);
                        }
                        Cookie = s3.substr(0, s3.indexOf(";"));
                    } else {
                        $.log(`获取Cookie_largeTurntable/activityInitEntry ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//login-common/initialization
async function login_common_initialization() {
    let login_common_initialization_data = `jrnNo=ACT3529&random=${await random(10000,99999)}`;
    let x_lemon_sign = get_sign("get", login_common_initialization_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/login-common/initialization?${login_common_initialization_data}`,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`login-common/initialization Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {

                    } else {
                        $.log(`login-common/initialization ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//login-common/ssoTokenLogin
async function login_common_ssoTokenLogin() {
    let login_common_ssoTokenLogin_data = {
        "jrnNo": "ACT3529",
        "needRegisterFlag": false,
        "ssoToken": ssoToken.substr(9),
        "ydrzToken": "",
        "random": await random(10000, 99999)
    };
    let x_lemon_sign = get_sign("post", login_common_ssoTokenLogin_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/login-common/ssoTokenLogin`,
            body: JSON.stringify(login_common_ssoTokenLogin_data),
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Origin": "https://ump.cmpay.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`login-common/ssoTokenLogin Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {

                    } else {
                        $.log(`login-common/ssoTokenLogin ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//lucky/loginCheck
async function lucky_loginCheck() {
    let lucky_loginCheck_data = `${ssoToken}&ssoApiChannel=&random=${await random(10000,99999)}`;
    let x_lemon_sign = get_sign("get", lucky_loginCheck_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/activities/v1/lucky/loginCheck?${lucky_loginCheck_data}`,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`lucky/loginCheck Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {

                    } else {
                        $.log(`lucky/loginCheck ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//maktcfgh5/bigTurn
async function maktcfgh5_bigTurn() {
    let lucky_loginCheck_data = `${ssoToken}&ssoApiChannel=&random=${await random(10000,99999)}`;
    let x_lemon_sign = get_sign("get", lucky_loginCheck_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
            headers: {
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "X-Requested-With": "com.cmcc.hebao",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`maktcfgh5/bigTurn Api请求失败`);
                } else {

                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//largeTurntable/activityInitEntry
async function largeTurntable_activityInitEntry2() {
    let largeTurntable_activityInitEntry_data = `jrnNo=ACT3529&usrId=&random=${await random(10000,99999)}`;
    let x_lemon_sign = get_sign("get", largeTurntable_activityInitEntry_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/largeTurntable/activityInitEntry?${largeTurntable_activityInitEntry_data}`,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`largeTurntable/activityInitEntry Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let mobileNo = data2.body.mobileNo;
                        if (mobileNo) {
                            $.log(`largeTurntable/activityInitEntry 大转盘登录成功`);
                        }
                    } else {
                        $.log(`largeTurntable/activityInitEntry ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//大转盘抽奖
async function largeTurntable_decimationIntegral() {
    let largeTurntable_decimationIntegral_data = {
        "jrnNo": "ACT3529",
        "operDfp": "",
        "preview": false,
        "activityId": "ZPHD2452",
        "usrId": "",
        "random": await random(10000, 99999)
    };
    let x_lemon_sign = get_sign("post", largeTurntable_decimationIntegral_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/largeTurntable/decimationIntegral`,
            body: JSON.stringify(largeTurntable_decimationIntegral_data),
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Origin": "https://ump.cmpay.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`大转盘抽奖 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let shareFlag = data2.body.shareFlag;
                        if (shareFlag) {
                            let popContent = data2.body.popConfig.popContent;
                            $.log(`大转盘抽奖 ${popContent}`);
                        } else {
                            let drawName = data2.body.popConfig.drawName;
                            let journalNo = data2.body.journalNo;
                            $.log(`大转盘抽奖 抽到 ${drawName}`);
                            await $.wait(1000); //等待1秒
                            await largeTurntable_distributeAward(journalNo, drawName);
                        }
                    } else {
                        $.log(`大转盘抽奖 ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//大转盘抽奖领取
async function largeTurntable_distributeAward(journalNo, drawName) {
    let largeTurntable_distributeAward_data = {
        "jrnNo": "ACT3529",
        "operDfp": "",
        "preview": false,
        "activityId": "ZPHD2452",
        "usrId": "",
        "journalNo": `${journalNo}`,
        "random": await random(10000, 99999)
    };
    let x_lemon_sign = get_sign("post", largeTurntable_distributeAward_data);
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/largeTurntable/distributeAward`,
            body: JSON.stringify(largeTurntable_distributeAward_data),
            headers: {
                "Accept": "application/json, text/plain, */*",
                "x-gry-type": "",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "x-lemon-sign": x_lemon_sign,
                "Origin": "https://ump.cmpay.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://ump.cmpay.com/front-msa/maktcfgh5/bigTurn?jrnNo=ACT3529&rulerId=FULS0122&utm_source=JHY&utm_medium=QT&utm_term=HBKHD&utm_content=53&utm_campaign=DZP&_channel_track_key=OuJ7uYbw&${ssoData2}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`大转盘抽奖领取 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        $.log(`大转盘抽奖领取 ${drawName} 成功`);
                    } else {
                        $.log(`大转盘抽奖领取 ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//查询积分
async function signAwardPoint_getUserPoint() {
    return new Promise((resolve) => {
        let url = {
            url: `https://ump.cmpay.com/activities/v1/signAwardPoint/getUserPoint`,
            headers: {
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 hebao/9.17.30 NetType/wifi UnionPay/1.0 CMPAY",
                "Referer": `https://ump.cmpay.com/info/version3/marketing_2022/signin/signin.html?utm_source=QD%26utm_medium=FF%26utm_term=45%26utm_content=hbkhd%26utm_campaign=QDLJF%26_channel_track_key=2msSrOXu&${ssoData1}&${ssoToken}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.msgCd == "MKM00000") {
                        let userPoint = data2.body.userPoint;
                        $.log(`查询积分 总${userPoint}积分`);
                    } else {
                        $.log(`查询积分 ${data2.msgInfo}`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t;
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s);
                });
            });
        }
        get(t) {
            return this.send.call(this.env, t);
        }
        post(t) {
            return this.send.call(this.env, t, "POST");
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        isQuanX() {
            return "undefined" != typeof $task;
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t);
            } catch {
                return e;
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t);
            } catch {
                return e;
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t));
            } catch {}
            return s;
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e);
            } catch {
                return !1;
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i));
            });
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i));
            }).catch(t => this.logErr(t));
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i));
                    } catch (t) {
                        return {};
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r;
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e;
                } catch (t) {
                    e = "";
                }
            }
            return e;
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i);
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i);
                }
            } else s = this.setval(t, e);
            return s;
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i);
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar;
                    }
                } catch (t) {
                    this.logErr(t);
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body);
            }));
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i);
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o);
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body);
                });
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t;
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        };
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        };
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        };
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h);
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t));
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
        }
    }(t, e);
}