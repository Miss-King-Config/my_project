/*
汇丰汇选 App

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#汇丰汇选
0 0 6,10 * * *, tag=汇丰汇选, img-url=, enabled=true

================Loon==============
[Script]
cron "0 0 6,10 * * *" script-path=, tag=汇丰汇选

===============Surge=================
汇丰汇选 = type=cron, cronexp="0 0 6,10 * * *", wake-system=1, timeout=33600, script-path=

============小火箭=========
汇丰汇选 = type=cron, script-path=, cronexpr="0 0 6,10 * * *", timeout=33600, enable=true
*/

const $ = new Env('汇丰汇选');
$.log(`需要新建环境变量: Hfhx_list\n填写 账号----密码\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    phone = "",
    password = "",
    token = "",
    userId = "",
    androidId = "",
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.210 Mobile Safari/537.36 android-river-app statusBarHeight/25";

const crypto = require('crypto'),
    publicKey = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI4QzAHlp/T6mmYMFSRM/M7SNbs5PvjpyYNqlp3i7CF6dnYndA2zekm8yBccYHEWEEcgqJDjRm+/GGuPrfHLdgdHH3tx+XHTxouZk+MeCdxW+M6sxKXGfDs2y3gvmrsNdnKMywRjqO9QaRBw6fgenl73fYyS+S+5y+CbrcyULyYQIDAQAB\n-----END PUBLIC KEY-----`,
    publicKey2 = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCp+paUFe4RNqnyDhQuHxn1dK0MAe3cRgkM252DomJ26ZCPkw16haE7yhfASs6qykMMoEPPymfyU+izN5nR/+x2DW86ERkxdnDmOys7+t2EjtlPaOCWn8vGWiic0PjsFDILG39swrDzWoLngTzfgHzBCeDs48GVM5NOW5wEZNLX3wIDAQAB\n-----END PUBLIC KEY-----`;

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
    const Hfhx_list = ($.isNode() ? (process.env.Hfhx_list) : ($.getval('Hfhx_list'))) || "";
    if (!Hfhx_list) {
        let str = Hfhx_list ? "" : "Hfhx_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Hfhx_list.indexOf('#') != -1) {
        appUrlArrs = Hfhx_list.split('#');
        $.log(`您选择的是用"#"隔开 Hfhx_list\n`);
    } else if (Hfhx_list.indexOf('\n') != -1) {
        appUrlArrs = Hfhx_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Hfhx_list\n`);
    } else if (Hfhx_list.indexOf('@') != -1) {
        appUrlArrs = Hfhx_list.split('@');
        $.log(`您选择的是用"@"隔开 Hfhx_list\n`);
    } else {
        appUrlArrs = [Hfhx_list];
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
    if (appUrlArrVal.indexOf("----") != -1) {
        phone = appUrlArrVal.split("----")[0];
        password = appUrlArrVal.split("----")[1];
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        x_forwarded_for = null;
        await X_Forwarded_For(); //虚拟IP
        await get_user_agent(); //虚拟UA
        androidId = randomStr(16);
        await open_login();
        await $.wait(1000); //等待1秒
        await signin_v4();
        await $.wait(1000); //等待1秒
        await pointstask_query();
        await $.wait(10000); //等待10秒
        await pointstask_query();
        await $.wait(1000); //等待1秒
        await pointsindex_v3();
        await $.wait(1000); //等待1秒
    }
}

function object_str(t) {
    var a = [];
    for (var b in t) a.push(b + "=" + t[b]);
    return a.join("&");
}

function object_query(t) {
    var a = [];
    for (var b in t) a.push(b);
    a.sort();
    var c = [];
    for (var d in a) c.push(a[d] + "=" + t[a[d]]);
    return c.join("&");
}

async function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//获取host
async function Host() {
    let host = await random(0, 255) + "." + await random(0, 255) + "." + await random(0, 255) + "." + await random(0, 255);
    return new Promise((resolve) => {
        let url = {
            url: `https://ip.taobao.com/outGetIpInfo`,
            body: `ip=${host}&accessKey=alibaba-inc`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取host Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 0) {
                        var country = data2.data.country;
                        if (country == "中国") {
                            x_forwarded_for = host;
                        }
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

async function X_Forwarded_For() {
    while (true) {
        await Host();
        if (x_forwarded_for != null) break;
    }
}

async function get_user_agent() {
    user_agent = "Mozilla/5.0 (Linux; Android " + await random(7, 14) + "; ELE-AL00 Build/HUAWEIELE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.210 Mobile Safari/537.36 android-river-app statusBarHeight/25";
}

function randomStr(i) {
    let t = "",
        e = "abcdef0123456789";
    for (let n = 0; n < i; n++) t += e.charAt(Math.floor(Math.random() * e.length));
    return t;
}

//生成uuid
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//MD5加密
function md5(data) {
    var md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest('hex');
}

//sha256加密
function sha256(data) {
    var md5 = crypto.createHash("sha256");
    md5.update(data);
    return md5.digest('hex');
}

//RSA加密
function RSA_encrypt(data, publicKey) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer).toString('base64');
    return encrypted;
}

//RSA解密
function RSA_decrypt(data, privateKey) {
    const buffer = Buffer.from(data, 'base64');
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer).toString('utf8');
    return decrypted;
}

//登录
async function open_login() {
    let pwd = md5(md5(`${password}`).substr(8, 16) + "RIVERAPP").substr(8, 16);
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/userservice/userinfo/open/login`,
            body: JSON.stringify({
                "agreementCodeList": ["ONEID_FINANCIAL_MARKETING"],
                "appVersion": "3.0.0",
                "appleToken": "",
                "code": "",
                "deviceModel": "ELE-AL00",
                "deviceType": 2,
                "loginScenes": 3,
                "osName": "9",
                "phone": `${phone}`,
                "pwd": `${pwd}`,
                "registerActivityId": "14679290",
                "registerActivityName": "",
                "registerDigitalChannelId": 14676513,
                "registerDigitalChannelName": "",
                "transferChannelId": "",
                "wechatCode": ""
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "X-HSBC-Request-Correlation-Id": "APP",
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json",
                "charset": "utf-8",
                "X-HSBC-Global-Region": "CN",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent": "okhttp/4.9.0",
                "ADRUM_1": "isMobile:true",
                "ADRUM": "isAjax:true"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        token = data2.data.token;
                        userId = data.substr(data.indexOf("\"userId\":") + 9);
                        userId = userId.substr(0, userId.indexOf(","));
                    } else {
                        $.log(`登录 ${data2.message}`);
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
async function signin_v4() {
    let timestamp = Date.now();
    let signin_v4_data = {
        "nonce": randomStr(16),
        "timestamp": `${timestamp}`,
        "userId": `${userId}`,
        "version": "1.0"
    };
    signin_v4_data.sign = RSA_encrypt(sha256(object_query(signin_v4_data)), publicKey);
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/pointscenter/signin/v4`,
            body: JSON.stringify(signin_v4_data),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "X-HSBC-Request-Correlation-Id": "APP",
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json",
                "charset": "utf-8",
                "X-HSBC-Global-Region": "CN",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "Content-Type": "application/json; charset=UTF-8",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "User-Agent": "okhttp/4.9.0",
                "ADRUM_1": "isMobile:true",
                "ADRUM": "isAjax:true"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        let pointAmount = data2.data.pointAmount;
                        $.log(`签到成功 获得${pointAmount}积分`);
                    } else {
                        $.log(`签到 ${data2.message}`);
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

//打开任务列表
async function pointstask_query() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mw.prod.app.hsbcfts.com.cn/api/sapp/biz/pointstask/query`,
            body: JSON.stringify({
                "pageIndex": 1,
                "pageSize": 50,
                "taskProgressList": [1, 2],
                "taskType": "ADVANCED",
                "noneTaskIdList": []
            }),
            https: {
                rejectUnauthorized: false
            },
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "Origin": "https://mw.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://mw.prod.app.hsbcfts.com.cn/multi-apps/points/?hideNavigation=1",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开任务列表 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        let pointTaskData = data2.data.pointTaskData;
                        for (let i in pointTaskData) {
                            let pointTaskId = pointTaskData[i].pointTaskId;
                            let pointTaskName = pointTaskData[i].pointTaskName;
                            let taskProgress = pointTaskData[i].taskProgress;
                            let taskMark = pointTaskData[i].taskMark;
                            if (taskProgress == 2) {
                                await $.wait(1000); //等待1秒
                                await collect_v2(pointTaskName, pointTaskId);
                            } else {
                                if (taskMark == "VISIT_INSURANCE") {
                                    //每月浏览保险频道
                                    await $.wait(1000); //等待1秒
                                    await tracebehaviorlog_addtrace2();
                                } else if (taskMark == "ADD_SAVE_MONEY_PLANS") {
                                    //每周建立存钱计划
                                    await $.wait(1000); //等待1秒
                                    await pension_saveorupdatescheduledinvestmentplan();
                                } else if (taskMark == "WELFARE_TOOL") {
                                    //体验财富规划工具
                                    await $.wait(1000); //等待1秒
                                    await open_querycalculatordefaultvalue();
                                    await $.wait(1000); //等待1秒
                                    await userevent_notifybyclient2();
                                } else if (taskMark == "ADD_FUND_MANAGER") {
                                    //体验经理选基工具
                                    await $.wait(1000); //等待1秒
                                    await scheme_savemanagerscheme();
                                } else if (taskMark == "READ_SHARE_DIV") {
                                    //阅读并分享文章
                                    let bizNox = ["H52023051010320019185", "H520230510112850828440", "H520230510104533843978", "H520230510113531610773", "H52023051013492359745", "H520230510135902999768", "H520230516112941132546", "H520230516122141243317", "H520230516132242354128", "H520230516142241234589"];
                                    let bizNo = bizNox[await random(0, 9)];
                                    await $.wait(1000); //等待1秒
                                    await userevent_notifybyclient("DIV_VIEW_PAGE", bizNo);
                                    await $.wait(1000); //等待1秒
                                    await userevent_notifybyclient("DIV_SHARE", bizNo);
                                } else if (taskMark.indexOf("VIEW_PAGE_") != -1) {
                                    await $.wait(1000); //等待1秒
                                    await tracebehaviorlog_addtrace(pointTaskName, taskMark);
                                }
                            }
                        }
                    } else {
                        $.log(`打开任务列表 ${data2.message}`);
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

//完成任务列表
async function collect_v2(pointTaskName, pointTaskId) {
    let timestamp = Date.now();
    let collect_v2_data = {
        "nonce": randomStr(16),
        "pointTaskId": `${pointTaskId}`,
        "timestamp": `${timestamp}`,
        "userId": `${userId}`,
        "version": "1.0"
    };
    collect_v2_data.sign = RSA_encrypt(sha256(object_query(collect_v2_data)), publicKey);
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/pointstask/collect/v2`,
            body: JSON.stringify(collect_v2_data),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "X-HSBC-Request-Correlation-Id": "APP",
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json",
                "charset": "utf-8",
                "X-HSBC-Global-Region": "CN",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "Content-Type": "application/json; charset=UTF-8",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "User-Agent": "okhttp/4.9.0",
                "ADRUM_1": "isMobile:true",
                "ADRUM": "isAjax:true"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`完成任务列表 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        let awardTotalCount = data2.data.awardTotalCount;
                        $.log(`完成任务列表 ${pointTaskName} 获得${awardTotalCount}积分`);
                    } else {
                        $.log(`完成任务列表 ${data2.message}`);
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

//每月浏览保险频道
async function tracebehaviorlog_addtrace2() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mw.prod.app.hsbcfts.com.cn/api/sapp/biz/tracebehaviorlog/addtrace`,
            body: JSON.stringify({
                "traceBehaviorAction": "VIEW_PAGE",
                "traceBehaviorScenes": "APP_IN_APP",
                "traceBehaviorStatus": "1",
                "extBizId": "73dbd401"
            }),
            https: {
                rejectUnauthorized: false
            },
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "Origin": "https://mw.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://mw.prod.app.hsbcfts.com.cn/multi-apps/points/?hideNavigation=1",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`每月浏览保险频道 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`每月浏览保险频道 ${data2.message}`);
                    } else {
                        $.log(`每月浏览保险频道 ${data2.message}`);
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

//每周建立存钱计划
async function pension_saveorupdatescheduledinvestmentplan() {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/wealth/asset/pension/saveorupdatescheduledinvestmentplan`,
            body: JSON.stringify({
                "days": 0,
                "depositAmount": "1",
                "fixedTarget": 1,
                "months": 12,
                "planName": "1",
                "planType": 40,
                "reminderStatus": 1,
                "startDate": timestamp,
                "status": 1,
                "timePeriod": 10,
                "timeUnit": 3
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "X-HSBC-Request-Correlation-Id": "APP",
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json",
                "charset": "utf-8",
                "X-HSBC-Global-Region": "CN",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "Content-Type": "application/json; charset=UTF-8",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "User-Agent": "okhttp/4.9.0",
                "ADRUM_1": "isMobile:true",
                "ADRUM": "isAjax:true"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`每周建立存钱计划 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`每周建立存钱计划 成功`);
                    } else {
                        $.log(`每周建立存钱计划 ${data2.message}`);
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

//体验财富规划工具
async function open_querycalculatordefaultvalue() {
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/wealth/lifeplan/open/querycalculatordefaultvalue`,
            body: JSON.stringify({
                "caiYunCityCode": "",
                "gender": "",
                "age": ""
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`体验财富规划工具 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        let data3 = data2.data;
                        await $.wait(1000); //等待1秒
                        await open_querypensioninfo(data3);
                    } else {
                        $.log(`体验财富规划工具 ${data2.message}`);
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

//体验财富规划工具2
async function open_querypensioninfo(data3) {
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/wealth/lifeplan/open/querypensioninfo`,
            body: JSON.stringify(data3),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`体验财富规划工具2 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`体验财富规划工具2 成功`);
                    } else {
                        $.log(`体验财富规划工具2 ${data2.message}`);
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

//体验财富规划工具分享
async function userevent_notifybyclient2() {
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/userevent/notifybyclient`,
            body: JSON.stringify({
                "userEventCode": "LIFEPLAN_SHARE_FIXED_INVESTMENT_TOOL"
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`体验财富规划工具分享 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`体验财富规划工具分享 ${data2.message}`);
                    } else {
                        $.log(`体验财富规划工具分享 ${data2.message}`);
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

//体验经理选基工具
async function scheme_savemanagerscheme() {
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/api/v1/fund/scheme/savemanagerscheme`,
            body: JSON.stringify({
                "schemeName": randomStr(16),
                "conditionCount": 23,
                "fundType": 6,
                "basicTypeList": [{
                    "reference": "",
                    "typeName": "从业年限",
                    "iconUrl": "manager2.png",
                    "boxInfoList": [{
                        "code": "20105",
                        "layoutPosition": 5,
                        "name": "不限(默认)"
                    }],
                    "isRadio": 1,
                    "parentType": 2,
                    "typeCode": 201,
                    "all": false,
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAAE4UlEQVRoBe1Zb2gcVRB/8y69YK2fFKz/8HqNlfaSQPGDrf9I7gJFEMFqELXSD0WoINKiCGLFCOKnKsUvFsRPWkTivw9C1eYuKWLjlzQ0d9dqe3e5RIUIFYrV2Ka3O8673uzuu7xN9oLdy8k9uJt5M7+ZN/Pe7Nvdt0K0eIOVxJ9PDEbn5k+/Q7abZQTe6i/kxlbiZ7Sru8+28ADZnlm/dstLifzwQqN+Oho1UPi5+Z92I4oXFG9VcDOR2xTfaCPbI2RzK/1S5HOK6AeN+pCNGlTxgN6AVQArba6t7jOwv2VLKLOh926UGAcbb2CvKHCQVuAJ7kuAJ5lvhNqInzIeQHwGAoa5jxIugg2l5PTUzywzUd8EMrHEDhvEewLFJpNhaDIQZyWKF5Pl/LemMRclMNrX14Ez5w/T7OwxGTRLRqv8Idx5097+sbGKN4ZF14A9e/7AagteBaxiUrF5g1e8tgKZjT33oI0/ImJ1dyLlJQHyICB8jRCZc4yxsg+FvY/7ANEY841QxIUy40HIQwI6DnFfRKwbhYWP0TivUBlHlRwAKiBhW7KYnWCcto3aNu4XteAJYIuI3JkqZo8ymGk61n2BeUVT05Mz3n5QfiSW8EDxQp0f5fPk6MbeHyzLqsagJhZtsZ/ku9iwvoQeYgXtCqOm4JUeI3DKxbk8y4JSmlHHj9en176/OPUN4Y55ZE6MSqYlQCVziwuU4y6vcwPF7Fe0ns/ShfV2J3Q+qmuD95St8hGRclfVp58p4ElW6TEKoZUQ134VDGixkYkOTOc+NskbkT1Qmpgl/GvL28AlWvcqTIuRJNoKLO9o9SFaPgEqKbfRrnB1nUhEF84Velxo+OnQ9fbfcbShRKl01rDHgXLeiVu7BhigaM3AMfLqwuZpIn1by5eQ7wpQCR0HwOO+qYeoQIQ+qght/+fhfROgh4yxZCk/xMBm0nS8e4h2UWMC/98Sqp/xc10Pd9bLuH9X4ehl5nFwMFKY/Mu4sl1b11VgeNi5QQb1yb5N1DiQCThTmaW7oW9ztrXMxJnX6Yn2DRNydgLeJPkQ64L6ZLyJtnwJtRMwLWuYsvYKhDnbprEC70J0ZvObyUG9jHB/ksyIrekck6A+HQMDEziBVDl3u8F+kShZyr5LQvVbtgX1uZSj9jWw1OyEoQtcQulY4ohfQKly/hnWZeLdO+lO/Dj3vZTOdD5PlnJfsCyoT8abaOAE6J3iaZODmsxJgHC9S2DPEd5JYAmccuv4rI1hJO1rwDgtIQrbKxDiZBuHavkV0HchoHOg2lE20XXelOklf4e378tL8REdx58w6qUoeuWBfdrovg2qGD1NTwDhVzoRiis9ncXc78HREXruO2/fj08VcipILVBfbECfdMDQXzsapcBUjG7TSwhwxFXhtvSGnufcfnM4FQNN5r08upTiGPOKOu+yqvP9pp745QWk77V4veqrRoBP6CvNl0LCH1cl4fwD4nq07UfoZveUOyL83RmF3gfPZkss0xJQQjqD2UuPAu8zYDVRehR5PlXKHfbGpJcQaRQApHyVpt45KvEaNIWnWFRM9cGrWBatAAc40rV1C1QWDiKIlLMzsTIsSjsOoEhjR/TlgcLkadOwvgkw+MT27ddZv8/fcQVs50s9664lXYPyYuTmtb/cNz7+z7Ucp+m+/wWD64kQ6l9iBgAAAABJRU5ErkJggg=="
                }, {
                    "reference": "基金经理在上一个报告期此类基金的在管总资产净值。数据来自恒生聚源数据。",
                    "typeName": "该类别基金在管总规模",
                    "iconUrl": "manager1.png",
                    "boxInfoList": [{
                        "code": "20301",
                        "layoutPosition": 1,
                        "name": "1亿以下"
                    }, {
                        "code": "20302",
                        "layoutPosition": 2,
                        "name": "1到5亿"
                    }, {
                        "code": "20303",
                        "layoutPosition": 3,
                        "name": "5到10亿"
                    }, {
                        "code": "20304",
                        "layoutPosition": 4,
                        "name": "10到20亿"
                    }, {
                        "code": "20305",
                        "layoutPosition": 5,
                        "name": "20到50亿"
                    }, {
                        "code": "20306",
                        "layoutPosition": 6,
                        "name": "50亿以上"
                    }],
                    "isRadio": 2,
                    "parentType": 2,
                    "typeCode": 203,
                    "all": false,
                    "icon": "data:image/png;base64,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"
                }],
                "performanceList": [{
                    "reference": "基金经理累计收益率采用基金经理管理基金的规模加权收益率计算。一般来说，基金经理累计收益率越高，表现越好。对于统计区间小于3年的累计收益率，不能反映该基金经理的长期收益表现，仅供参考。数据来自恒生聚源资讯。",
                    "typeName": "累计收益率",
                    "iconUrl": "fund8.png",
                    "boxInfoList": [{
                        "code": "30101",
                        "layoutPosition": 1,
                        "name": "前25%"
                    }, {
                        "code": "30102",
                        "layoutPosition": 2,
                        "name": "前25%~50%"
                    }, {
                        "code": "30103",
                        "layoutPosition": 3,
                        "name": "后25%~50%"
                    }, {
                        "code": "30104",
                        "layoutPosition": 4,
                        "name": "后25%"
                    }],
                    "isRadio": 2,
                    "parentType": 3,
                    "typeCode": 301,
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAolBMVEUAAAC+Ii29ISu+IS29ISu+ISzWKlO9ISy9ICy9ICy8ICu9ICu9ICu9ISu+ISy+ISu+Iy2/JC7BIy/BJzHCPT3/a2u9ICu9ICu8ICvDLTXLIjS9ICy9ICu9ISu9ISu9ICu9Iiy+IizAIyzHKjnEOzu9ICu9ICu9ICu+ISy9ISu9Iiy9ISy+ISy8Iy3BIS7FJTG9ICu8ISu9ISy+Iiu/IC68ICtC0YByAAAANXRSTlMAcfN9+ngG6c2u7OXgk2RKKyMeGAQC98igEQ7828KzpkM7NwwI8Na3iINoW1ZQJhTQmYxqX87q/JcAAAFoSURBVDjLxZLrbuIwEEaHxE5CArkAgXKnlLa7ve31vP+r7cT7qz+MrUpVjxRnJjqS428sX8/CFoYAprALNfdEsV+IJRIrBeTpKECaQyEGUgmSghFgFFZHqr1T25sqP5xi1HPCwFNYXVQ4tp04buvMp75CeftWwDfXWrA+9Q/ciNTDqryghU99hsk8e4TpsPsS8plP3dyDSbQ/i3QlJGd/AjWOXyLrHWxfr+X68gC57SXbu69XVGU2GwI6MvxwQHV8Bw59jPoXKO4kQj2ZITSJUNt7jamVCHU+AdOI5jX7cV29rLSvNYmjYXvorqj9GHdb5jsGqs6v/tZurO8pMNHn6FWftFldtCjhWU5gMo/aJ7BzhzGwkX4Ja48qK8o3V+jm006HVmY+dV6vxWH5zzQwWOXy6MzVXViVbPQzf7BqelQPH1ErDT0LmdkYKtGFZRJg6abYGqIwrUiTE0HeiLJpbBrANhv5JP4BFFpzc+kX/UQAAAAASUVORK5CYII="
                }, {
                    "reference": "基金经理年化波动率基于基金经理管理基金的规模加权收益率计算。一般来说，基金经理年化波动率越低，表现越好。对于统计区间小于3年的年化波动率，不能反映该基金经理长期的风险水平，仅供参考。数据来自恒生聚源资讯。",
                    "typeName": "年化波动率",
                    "iconUrl": "fund9.png",
                    "boxInfoList": [{
                        "code": "30201",
                        "layoutPosition": 1,
                        "name": "前25%"
                    }, {
                        "code": "30202",
                        "layoutPosition": 2,
                        "name": "前25%~50%"
                    }, {
                        "code": "30203",
                        "layoutPosition": 3,
                        "name": "后25%~50%"
                    }, {
                        "code": "30204",
                        "layoutPosition": 4,
                        "name": "后25%"
                    }],
                    "isRadio": 2,
                    "parentType": 3,
                    "typeCode": 302,
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAkFBMVEUAAAC9ICu9Ii2+Iiy9ICu8ISu9ICzYJ0y9ICu9ICy9ICu9ICu9ICvOS0u8ISvEIjG9ICy+ISy+IizDIy69ICu9ISy9ISy9ICu9ISy9ISu+IjDHKDO9ICu9ISzEOzu9Iiu+IS6/Iy69ISu9ISy9ICu9ISu9ICu+ISvAIi/HMDi9ISy9ICu/ISy8ISy8ISy8ICtpPzt8AAAAL3RSTlMA4UIu9PnABt2Q6aZ0A9kd8FY7FaF8XNWKxB8P96kIUTcrmUW5sZSHJQrPgUesY52qDKkAAAIESURBVDjLpVXbYqIwEA1Xg4DcikWhKtXW2naX//+7nZMEgiS1DzsPEmdOMmcumbCFeHUcbvJ8E8a1xx6IF/FhJjz6Cb1/Ggx5yizAVRNIq0/OiYQv/3XX1RJZ7YTFidxUKlI3coRqVy1YOgK4vddupda7Q8JdkKwMVkkASjNshd3rklmkXMOUTXvB8zljVsmeyfg5+mv0RlsOce6X2hcQT+3d5AB7L5bIfKLUX7wxsQkB3kT0KKHi4tL626wOov6gRUTfMZ8vqCUzZEvqV/pySvKYNGQxPxjQ1KG4U+E/mkhBjioveTyV5J3UJ1bTr6s0sgVjsT7TikLUMdQspsKlWoE6CgYXLMuRQYcTQiqUDoqHisGHbO5WmTbDEDKq20UH1YDui2Tn63TgwA3LqSMLIa/gvgeDG2sJV8NDciyKYwuHOQuGmawZvAyFyMX+NKqdVkCdOfSdsSt9/iCRF5BXUgoC9QyZU/VwVLdFBVVToUFvHGGx3p3khghg9lXR2vP3+eyWh7SzFhzRqZqz+xIYcpTQk9bIlvJM6MEX9JbtwplF3gBNlk0Y2aB/cdGrZWv3Nmgl74eWxGx4HYTvLa5hl+lY+nRm7Nvl5b5Of1s+fGY/jAE0xU6PqOLxIHJmQWYPx1vumUOT/zI0fx/F5oDvbAM+aFa28Wh9Nv73MdJPnO/bnrh//9FjhXzcxWcAAAAASUVORK5CYII="
                }, {
                    "reference": "基金经理最大回撤基于基金经理管理基金的规模加权收益率计算。最大回撤大致反映了在该统计区间内投资该基金经理旗下基金产品可能遭受的最大损失比例。一般来说，基金最大回撤越小，表现越好。数据来自恒生聚源资讯。",
                    "typeName": "最大回撤",
                    "iconUrl": "fund10.png",
                    "boxInfoList": [{
                        "code": "30301",
                        "layoutPosition": 1,
                        "name": "前25%"
                    }, {
                        "code": "30302",
                        "layoutPosition": 2,
                        "name": "前25%~50%"
                    }, {
                        "code": "30303",
                        "layoutPosition": 3,
                        "name": "后25%~50%"
                    }, {
                        "code": "30304",
                        "layoutPosition": 4,
                        "name": "后25%"
                    }],
                    "isRadio": 2,
                    "parentType": 3,
                    "typeCode": 303,
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAdVBMVEUAAAC+Ii2+IS29ISu8ICy9ICu8ISy+Ii3HQkK9ICy+ISy9ICvHJzS8ICu+ISy+IizNM029ISy9ICy+ISy9ISzAIy69ICu9ICy9ISu9ICzMMzO8ICu9ICu9ICy9ISu9ISy+ISy+Iy3CJi29ISu9ISu/KDC8ICsEFwztAAAAJnRSTlMAcX3znZ9FQgP7SbAO+Yp5BujNYVUs3dbCuQrmqJB7a005IevIIALaFsIAAAETSURBVDjLzdPLboMwEIXhwc3FGBtzTVJyT9t5/0fsYVNTNMjeRMm/QEZ8EpYZ6PVp3+QcKW+8hjxwUgdNnhPz1DDXKoukauaGsE9F0RT2S8ycxWkGNqP9RifSlrlNo1fcXCM03BdVCr1gedKUQBVWe7P9qx+WqOF5rrjLtGOhUktUn7DarUPf47ytBApb4ON1FLJrPOskStUn7I0mlXiPntFg3YNC1Y75LlIaMOaGJp3xUKZkS0XTWhyCROUxvSRSbL5LozdmZ5Oo+Rq3KtPHJmSyYpwfK9NtzrP2P4uj/b/8bGmBDmo1qWwBBSr3bvQYfujlKpzxkXBh9xHJARXUO07K9USmTpG1IWSNV5G8sfSkfgEELlHwUsQ8+QAAAABJRU5ErkJggg=="
                }, {
                    "reference": "定义为在统计区间内（该基金经理的年化收益率-无风险收益率) / 该基金经理的年化波动率，反映了投资于该基金经理管理产品的投资者额外承受的每一单位风险所获得的额外收益。计算基于基金经理管理基金的规模加权收益率。其中无风险收益率采用恒生聚源货币基金指数收益率。数据来自恒生聚源资讯。",
                    "typeName": "夏普比率",
                    "iconUrl": "fund11.png",
                    "boxInfoList": [{
                        "code": "30401",
                        "layoutPosition": 1,
                        "name": "前25%"
                    }, {
                        "code": "30402",
                        "layoutPosition": 2,
                        "name": "前25%~50%"
                    }, {
                        "code": "30403",
                        "layoutPosition": 3,
                        "name": "后25%~50%"
                    }, {
                        "code": "30404",
                        "layoutPosition": 4,
                        "name": "后25%"
                    }],
                    "isRadio": 2,
                    "parentType": 3,
                    "typeCode": 304,
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAllBMVEUAAAC9ICzKLzW9ICu9ICzIJDf/np69ICu9ICzAJi3OMUi9ICu9ICvAJC+9ICy9ICzAIy69ICu+ICy9ICy9ISy9ISy+IS2+IS2/Iy2/ISy9ISy9ICu9ICu9ICu9ISy9IS2+ICzCIzHdRka8ICu9ISu9ISy+ISu/Ii2/Iy6+ISy9ISu9ICu9ICu9ICy9ISu9ISzEKTe8ICusabbHAAAAMXRSTlMA/Ap1vw0B+NwhB/OzFsXuJuacloqDWD86NdGooY1qU08dA867e2BGMC3i2NWuknAS4IAhCQAAAdRJREFUOMvlU9ly4jAQlIHY2PgCHwGMjTlCEkIg/f8/ty2ClGHLuPZxq9Iv9mhaUk/PSP0ObJrzZ3ycfsSzy3sv72UHgWPhPyB+1R7+gvPaRXSHCQgvvKznm828vIR646qD+RSCGK2fxNIhjDsU+EsST+0/1O1PySy23Tn/7vYTRZaqE0NgLiqizsniIRPikBeG68fMUWDDaEKdPczBT5wBO1fko7Zp2q97ZnQ1MXUA0ZT5njFR+YL57B21Dzmwt8RtDQMvtEzNqfn5EIe6lW78KMtGPFrofAWmW5XSqECWEadXWTF/lwNzxJTu6mwlvZi5t+wMSOxEMBiqFXAQBo+tNYMx0yY4AJ9qBDybhd1dK9YUY/4XNFRXlZoFD5BDSAVWGutSE6Z/chMlIFIBzdMnBaZOB44YxC1D1wjXp9CGjUmOhW62iEXad6fFcPztKz7TdNe2Yw+cTfAGnFQozHpnjxoTNADeTFDSLO1lpoTTTn6VHuTctpLTV0hFVL8Ew6Isi7Hpq6giSOTjiWJYxJESHdCDksmLVDBMvonJkDkDdn/2vcNJhfGDtq6quh2IpdS7VUhTQtWLkCZai/w+ps97b7blYvQkxDjmtsBI9SJaqP8BfwBqQEVRy+wbhgAAAABJRU5ErkJggg=="
                }],
                "performanceRange": "502"
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/multi-apps/fund/?hideNavigation=1",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`体验经理选基工具 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        if (data2.data.retCode == 0) {
                            $.log(`体验经理选基工具 成功`);
                        } else {
                            $.log(`体验经理选基工具 ${data2.data.message}`);
                        }
                    } else {
                        $.log(`体验经理选基工具 ${data2.message}`);
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

//阅读并分享文章
async function userevent_notifybyclient(userEventCode, bizNo) {
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/userevent/notifybyclient`,
            body: JSON.stringify({
                "userEventCode": `${userEventCode}`,
                "bizNo": `${bizNo}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/multi-apps/combined-pages/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`阅读并分享文章 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`阅读并分享文章 ${data2.message}`);
                    } else {
                        $.log(`阅读并分享文章 ${data2.message}`);
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

//VIEW_PAGE类任务
async function tracebehaviorlog_addtrace(pointTaskName, taskMark) {
    let traceBehaviorScenes = taskMark.substr(taskMark.indexOf("VIEW_PAGE_") + 10);
    return new Promise((resolve) => {
        let url = {
            url: `https://m.prod.app.hsbcfts.com.cn/api/sapp/biz/tracebehaviorlog/addtrace`,
            body: JSON.stringify({
                "traceBehaviorAction": "VIEW_PAGE",
                "traceBehaviorStatus": "1",
                "behaviorMessage": "",
                "extBizId": "",
                "traceBehaviorScenes": `${traceBehaviorScenes}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Content-Type": "application/json",
                "Origin": "https://m.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://m.prod.app.hsbcfts.com.cn/multi-apps/fund/?hideNavigation=1",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`VIEW_PAGE类任务 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        $.log(`VIEW_PAGE类任务 ${pointTaskName} ${data2.message}`);
                    } else {
                        $.log(`VIEW_PAGE类任务 ${data2.message}`);
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
async function pointsindex_v3() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mw.prod.app.hsbcfts.com.cn/api/sapp/biz/pointscenter/open/pointsindex/v3`,
            https: {
                rejectUnauthorized: false
            },
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "X-HSBC-Global-Channel-Id": "MOBILE_A",
                "X-HSBC-Global-Tenant-Id": "HXN",
                "X-HSBC-Pinnacle-DeviceNo": `${androidId}`,
                "X-HSBC-Pinnacle-SuperAPP-ClientVersion": "3.0.0",
                "Accept": "application/json, text/plain, */*",
                "X-HSBC-E2E-Trust-Token": `${token}`,
                "X-HSBC-Request-Correlation-Id": generateUUID(),
                "User-Agent": `${user_agent}`,
                "Origin": "https://mw.prod.app.hsbcfts.com.cn",
                "X-Requested-With": "com.hsbcfts.fintechapp",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://mw.prod.app.hsbcfts.com.cn/multi-apps/points/?hideNavigation=1",
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == 10000) {
                        let pointBalance = data2.data.pointBalance;
                        $.log(`查询积分 总${pointBalance}积分`);
                    } else {
                        $.log(`查询积分 ${data2.message}`);
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