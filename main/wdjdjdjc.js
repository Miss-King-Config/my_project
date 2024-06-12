/*
微信公众号 万达酒店及度假村 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#万达酒店及度假村
00 00 7,9 * * * , tag=万达酒店及度假村, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 7,9 * * *" script-path=,tag=万达酒店及度假村

===============Surge=================
万达酒店及度假村 = type=cron,cronexp="00 00 7,9 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
万达酒店及度假村 = type=cron,script-path=, cronexpr="00 00 7,9 * * *", timeout=33600, enable=true
*/

const $ = new Env('万达酒店及度假村');
$.log(`需要新建环境变量: Wdjdjdjc_list\n填写账号----密码\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
    username = "",
    password = "",
    wandahotels_Cookie = null,
    Cookie = null;

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
    const Wdjdjdjc_list = ($.isNode() ? (process.env.Wdjdjdjc_list) : ($.getval('Wdjdjdjc_list'))) || "";
    if (!Wdjdjdjc_list) {
        let str = Wdjdjdjc_list ? "" : "Wdjdjdjc_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Wdjdjdjc_list.indexOf('#') != -1) {
        appUrlArrs = Wdjdjdjc_list.split('#');
        $.log(`您选择的是用"#"隔开 Wdjdjdjc_list\n`);
    } else if (Wdjdjdjc_list.indexOf('\n') != -1) {
        appUrlArrs = Wdjdjdjc_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Wdjdjdjc_list\n`);
    } else if (Wdjdjdjc_list.indexOf('@') != -1) {
        appUrlArrs = Wdjdjdjc_list.split('@');
        $.log(`您选择的是用"@"隔开 Wdjdjdjc_list\n`);
    } else {
        appUrlArrs = [Wdjdjdjc_list];
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
        username = appUrlArrVal.split("----")[0];
        password = appUrlArrVal.split("----")[1];
    }
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
    user_agent = "Mozilla/5.0 (Linux; Android " + await random(7, 14) + "; ELE-AL00 Build/PQ3A." + await random(100000, 999999) + "." + await random(100, 999) + "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/" + await random(1000000, 9999999) + " MMWEBSDK/20231202 MMWEBID/" + await random(1000, 9999) + " MicroMessenger/8.0." + await random(20, 47) + "." + await random(1000, 9999) + "(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android";
}

async function init_info() {
    x_forwarded_for = null, user_agent = null, wandahotels_Cookie = null, Cookie = null;
    await X_Forwarded_For(); //虚拟IP
    await get_user_agent(); //虚拟UA
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        $.log(`账号: ${username}`);
        $.log(`密码: ${password}`);
        await init_info();
        await index_php_login();
        await $.wait(2000); //等待2秒
        await index_php_duibashop();
        await $.wait(2000); //等待2秒
        await sign_component_page("169563444704837");
        await $.wait(2000); //等待2秒
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

//登录
async function index_php_login() {
    return new Promise((resolve) => {
        let url = {
            url: `https://www.wandahotels.com/index.php?m=member&c=index&a=login&siteid=1`,
            body: `type=ajax&username=${username}&password=${password}&check=0`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://www.wandahotels.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://www.wandahotels.com/index.php?m=member&c=member&a=login&siteid=1&referer=https%3A%2F%2Fwww.wandahotels.com%2Findex.php%3Fm%3Dduibashop%26c%3Dintegral",
                "Cookie": ``
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let s3 = "";
                    for (let i in resp.headers['set-cookie']) {
                        let s2 = resp.headers['set-cookie'][i];
                        if (s2.indexOf(";") != -1) {
                            s3 += s2.substring(0, s2.indexOf(";")) + "; ";
                        } else {
                            s3 += s2 + "; ";
                        }
                    }
                    wandahotels_Cookie = s3.trim();
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//打开页面
async function index_php_duibashop() {
    return new Promise((resolve) => {
        let url = {
            url: `https://www.wandahotels.com/index.php?m=duibashop&c=integral`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                //"User-Agent": `${user_agent}`,
                "Upgrade-Insecure-Requests": "1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Dest": "document",
                "Referer": "https://www.wandahotels.com/index.php?m=member&c=member&a=login&siteid=1&referer=https%3A%2F%2Fwww.wandahotels.com%2Findex.php%3Fm%3Dduibashop%26c%3Dintegral",
                "Cookie": `${wandahotels_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开页面 Api请求失败`);
                } else {
                    let html = data;
                    let uid = null,
                        accessKey = null,
                        timestamp = null,
                        extend = null,
                        version = null,
                        returnUrl = null,
                        sign = null,
                        phone = null;
                    if (html.indexOf("uid") != -1) {
                        uid = html.substr(html.indexOf("uid") + 12);
                        uid = uid.substr(0, uid.indexOf("\""));
                        //console.log(uid);
                    }
                    if (html.indexOf("accessKey") != -1) {
                        accessKey = html.substr(html.indexOf("accessKey") + 18);
                        accessKey = accessKey.substr(0, accessKey.indexOf("\""));
                        //console.log(accessKey);
                    }
                    if (html.indexOf("timestamp") != -1) {
                        timestamp = html.substr(html.indexOf("timestamp") + 18);
                        timestamp = timestamp.substr(0, timestamp.indexOf("\""));
                        //console.log(timestamp);
                    }
                    if (html.indexOf("extend") != -1) {
                        extend = html.substr(html.indexOf("extend") + 15);
                        extend = extend.substr(0, extend.indexOf("\""));
                        //console.log(extend);
                    }
                    if (html.indexOf("version") != -1) {
                        version = html.substr(html.indexOf("version") + 16);
                        version = version.substr(0, version.indexOf("\""));
                        //console.log(version);
                    }
                    if (html.indexOf("returnUrl") != -1) {
                        returnUrl = html.substr(html.indexOf("returnUrl") + 18);
                        returnUrl = returnUrl.substr(0, returnUrl.indexOf("\""));
                        //console.log(returnUrl);
                    }
                    if (html.indexOf("sign") != -1) {
                        sign = html.substr(html.indexOf("sign") + 13);
                        sign = sign.substr(0, sign.indexOf("\""));
                        //console.log(sign);
                    }
                    if (html.indexOf("phone") != -1) {
                        phone = html.substr(html.indexOf("phone") + 14);
                        phone = phone.substr(0, phone.indexOf("\""));
                        //console.log(phone);
                    }
                    await $.wait(2000); //等待2秒
                    await wanda_autoLogin(uid, accessKey, timestamp, extend, version, returnUrl, sign, phone);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//跳转登录
async function wanda_autoLogin(uid, accessKey, timestamp, extend, version, returnUrl, sign, phone) {
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/customActivity/wanda/autoLogin`,
            body: `uid=${encodeURIComponent(uid)}&accessKey=${encodeURIComponent(accessKey)}&timestamp=${encodeURIComponent(timestamp)}&extend=${encodeURIComponent(extend)}&version=${encodeURIComponent(version)}&returnUrl=${encodeURIComponent(returnUrl)}&sign=${encodeURIComponent(sign)}&phone=${encodeURIComponent(phone)}`,
            followRedirect: false,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "cache-control": "max-age=0",
                "upgrade-insecure-requests": "1",
                "origin": "https://www.wandahotels.com",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "cross-site",
                "sec-fetch-mode": "navigate",
                "sec-fetch-dest": "document",
                "referer": "https://www.wandahotels.com/",
                "Cookie": ``
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`跳转登录 Api请求失败`);
                } else {
                    let autologin_url = resp.headers['location'];
                    await $.wait(2000); //等待2秒
                    await autoLogin_autologin(autologin_url);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取Cookie
async function autoLogin_autologin(autologin_url) {
    return new Promise((resolve) => {
        let url = {
            url: `${autologin_url}`,
            followRedirect: false,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "cache-control": "max-age=0",
                "upgrade-insecure-requests": "1",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "cross-site",
                "sec-fetch-mode": "navigate",
                "sec-fetch-dest": "document",
                "referer": "https://www.wandahotels.com/",
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`autoLogin_autologin Api请求失败`);
                } else {
                    let s3 = "";
                    for (let i in resp.headers['set-cookie']) {
                        let s2 = resp.headers['set-cookie'][i];
                        if (s2.indexOf(";") != -1) {
                            s3 += s2.substring(0, s2.indexOf(";")) + "; ";
                        } else {
                            s3 += s2 + "; ";
                        }
                    }
                    Cookie = s3.trim();
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
//打开签到页面
async function sign_component_page(signOperatingId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-3.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Referer": `https://80263.activity-11.m.duiba.com.cn/chw/visual-editor/skins?id=178141&from=login&spm=80263.1.1.1`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开签到页面Api请求失败`);
                } else {
                    let html = data;
                    let htmlx = html.substring(html.indexOf("获取token") - 8);
                    htmlx = htmlx.substring(0, htmlx.indexOf("</script>"));
                    eval(htmlx);
                    let htmlx2 = eval(htmlx.substring(htmlx.indexOf("\\u0065\\u0076\\u0061\\u006c") + 24));
                    let key = htmlx2.substring(htmlx2.indexOf("var key = '") + 11);
                    key = key.substring(0, key.indexOf("';"));
                    await getToken(key, signOperatingId);
                    await $.wait(5000); //等待5秒
                    await sign_component_index(key, signOperatingId);
                    await $.wait(5000); //等待5秒
                    await ctool_getCredits(signOperatingId);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取getToken
async function getToken(key, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/chw/ctoken/getToken`,
            body: `timestamp=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取getToken Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var window = {};
                        eval(data2.token);
                        let token = window[key];
                        $.log("获取getToken成功");
                        await sign_component_doSign(token, signOperatingId);
                    } else {
                        $.log(`获取getToken错误`);
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

//开始签到
async function sign_component_doSign(token, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/sign/component/doSign?_=${timestamp}`,
            body: `signOperatingId=${signOperatingId}&token=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        $.log(`签到成功`);
                        let orderNum = data2.data.orderNum;
                        await $.wait(5000); //等待5秒
                        await sign_component_signResult(orderNum, signOperatingId);
                    } else {
                        $.log(`签到` + data2.desc);
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

//签到结果
async function sign_component_signResult(orderNum, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/sign/component/signResult?orderNum=${orderNum}&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到结果Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var credits = data2.data.credits;
                        $.log(`签到结果 获得` + credits + `积分`);
                    } else {
                        $.log(`签到结果` + data2.desc);
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

//查询抽奖机会
async function sign_component_index(key, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-3.m.duiba.com.cn/sign/component/index?signOperatingId=${signOperatingId}&preview=false&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Referer": `https://80263.activity-3.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询抽奖机会Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var times = data2.data.times;
                        $.log(`查询抽奖机会 共有` + times + `抽奖机会`);
                        if (times > 0) {
                            await $.wait(5000); //等待5秒
                            await getToken2(key, signOperatingId);
                        }
                    } else {
                        $.log(`查询抽奖机会` + data2.desc);
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

//获取getToken2
async function getToken2(key, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/chw/ctoken/getToken`,
            body: `timestamp=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取getToken2 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var window = {};
                        eval(data2.token);
                        let token = window[key];
                        $.log("获取getToken2成功");
                        await sign_component_doJoin(token, signOperatingId);
                    } else {
                        $.log(`获取getToken2错误`);
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

//开始抽奖
async function sign_component_doJoin(token, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-3.m.duiba.com.cn/sign/component/doJoin?_=${timestamp}`,
            body: `signOperatingId=${signOperatingId}&token=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`开始抽奖Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        $.log(`开始抽奖成功`);
                        let orderNum = data2.data.orderNum;
                        await $.wait(5000); //等待5秒
                        await getOrderStatus(orderNum, signOperatingId);
                    } else {
                        $.log(`开始抽奖` + data2.desc);
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

//抽奖结果
async function getOrderStatus(orderNum, signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/plugin/getOrderStatus?orderId=${orderNum}&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`抽奖结果Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var type = data2.lottery.type;
                        $.log(`抽奖结果 ` + type);
                    } else {
                        $.log(`抽奖结果` + data2.desc);
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
async function ctool_getCredits(signOperatingId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://80263.activity-11.m.duiba.com.cn/ctool/getCredits?_=${timestamp}`,
            body: ``,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分Api 请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        let credits = data2.data.credits;
                        $.log(`查询积分 总` + credits + "积分");
                    } else {
                        $.log(`查询积分` + data2.desc);
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