/*
微信公众号 海信爱家 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#海信爱家
00 00 7,9 * * * , tag=海信爱家, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 7,9 * * *" script-path=,tag=海信爱家

===============Surge=================
海信爱家 = type=cron,cronexp="00 00 7,9 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
海信爱家 = type=cron,script-path=, cronexpr="00 00 7,9 * * *", timeout=33600, enable=true
*/

const $ = new Env('海信爱家');
$.log(`需要新建环境变量: Hxaj_list\n填写账号----密码\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
    mobile = "",
    password = "",
    jf_Cookie = null,
    cps_Cookie = null,
    token = null;

const crypto = require('crypto');

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
    const Hxaj_list = ($.isNode() ? (process.env.Hxaj_list) : ($.getval('Hxaj_list'))) || "";
    if (!Hxaj_list) {
        let str = Hxaj_list ? "" : "Hxaj_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Hxaj_list.indexOf('#') != -1) {
        appUrlArrs = Hxaj_list.split('#');
        $.log(`您选择的是用"#"隔开 Hxaj_list\n`);
    } else if (Hxaj_list.indexOf('\n') != -1) {
        appUrlArrs = Hxaj_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Hxaj_list\n`);
    } else if (Hxaj_list.indexOf('@') != -1) {
        appUrlArrs = Hxaj_list.split('@');
        $.log(`您选择的是用"@"隔开 Hxaj_list\n`);
    } else {
        appUrlArrs = [Hxaj_list];
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
        mobile = appUrlArrVal.split("----")[0];
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
    x_forwarded_for = null, user_agent = null, jf_Cookie = null, cps_Cookie = null, token = null;
    await X_Forwarded_For(); //虚拟IP
    await get_user_agent(); //虚拟UA
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        $.log(`账号: ${mobile}`);
        $.log(`密码: ${password}`);
        await init_info();
        await user_login();
        await $.wait(1000); //等待1秒
        await user_getSimpleUserInfo();
        await $.wait(1000); //等待1秒
        await hisense_moreActivities_shtml();
        await $.wait(1000); //等待1秒
        await activityUser_getActivityList();
        await $.wait(1000); //等待1秒
        await index_getTotalScore();
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

function generateMixed(n) {
    var res = "";
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * (chars.length - 1));
        res += chars[id];
    }
    return res;
}

function getcch() {
    let cred = generateMixed(10);
    let node = generateMixed(8);
    return cred + '_' + node;
}

//MD5加密
function md5(data) {
    var md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest('hex');
}

//登录
async function user_login() {
    return new Promise((resolve) => {
        let url = {
            url: `https://jf.hisense.com/api/user-manage/front/user/login`,
            body: `mobile=${mobile}&password=${password}&captcha=&target=https%3A%2F%2Fjf.hisense.com%2F&isRememberMe=0`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "Accept": "*/*",
                "cch": getcch(),
                "Origin": "https://jf.hisense.com",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://jf.hisense.com/login/",
                "Cookie": ``
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        let s3 = "";
                        for (let i in resp.headers['set-cookie']) {
                            let s2 = resp.headers['set-cookie'][i];
                            if (s2.indexOf(";") != -1) {
                                s3 += s2.substring(0, s2.indexOf(";")) + "; ";
                            } else {
                                s3 += s2 + "; ";
                            }
                        }
                        jf_Cookie = s3.trim();
                    } else {
                        $.log(`登录 ${html.resultMsg}`);
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

//获取token
async function user_getSimpleUserInfo() {
    return new Promise((resolve) => {
        let url = {
            url: `https://jf.hisense.com/api/user-manage/front/user/getSimpleUserInfo`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "*/*",
                "cch": getcch(),
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://jf.hisense.com/user/mycener/",
                "Cookie": `${jf_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取token Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        token = html.data.token;
                        cps_Cookie = "TOKEN_ACTIVITY=" + token;
                    } else {
                        $.log(`获取token ${html.resultMsg}`);
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

//打开积分任务页面
async function hisense_moreActivities_shtml() {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/static/hisense_moreActivities.shtml?TOKEN_ACTIVITY=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Upgrade-Insecure-Requests": "1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/wxpic,image/tpg,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Referer": "https://jf.hisense.com/user/mycener/",
                "Cookie": ``
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开积分任务页面 Api请求失败`);
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
                    cps_Cookie = s3.trim() + "; TOKEN_ACTIVITY=" + token;
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//积分任务
async function activityUser_getActivityList() {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/customerAth/activity-manage/activityUser/getActivityList?channel=1`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `https://cps.hisense.com/static/hisense_moreActivities.shtml?TOKEN_ACTIVITY=${token}`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`积分任务 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        let data2 = html.data;
                        for (let i = 0; i < data2.length; i++) {
                            let code = data2[i].code;
                            let name = data2[i].name;
                            let status = data2[i].status;
                            if (status == 1) {
                                if (name == "签到") {
                                    await game_sign_shtml(code);
                                    await $.wait(1000); //等待1秒
                                    let Referer = `https://cps.hisense.com/static/game_sign.shtml?code=${code}`;
                                    await activityUser_getActivityInfo(name, code, Referer);
                                } else if (name == "打地鼠") {
                                    await game_playDiglett_shtml(code);
                                    await $.wait(1000); //等待1秒
                                    let Referer = `https://cps.hisense.com/static/game_playDiglett.shtml?code=${code}`;
                                    await activityUser_getActivityInfo(name, code, Referer);
                                }
                            } else {
                                $.log(`积分任务 ${name} 任务未开始`);
                            }
                        }
                    } else {
                        $.log(`积分任务 ${html.resultMsg}`);
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

//打开签到页面
async function game_sign_shtml(code) {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/static/game_sign.shtml?code=${code}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Upgrade-Insecure-Requests": "1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/wxpic,image/tpg,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Referer": `https://cps.hisense.com/static/hisense_moreActivities.shtml?TOKEN_ACTIVITY=${token}`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开签到页面 Api请求失败`);
                } else {}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//打开打地鼠页面
async function game_playDiglett_shtml(code) {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/static/game_playDiglett.shtml?code=${code}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Upgrade-Insecure-Requests": "1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/wxpic,image/tpg,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Referer": `https://cps.hisense.com/static/hisense_moreActivities.shtml?TOKEN_ACTIVITY=${token}`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开打地鼠页面 Api请求失败`);
                } else {}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//打开任务页面
async function activityUser_getActivityInfo(name, code, Referer) {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/customerAth/activity-manage/activityUser/getActivityInfo?code=${code}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `Referer`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开任务页面 ${name} Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        let userRemainingCount = html.data.userRemainingCount;
                        let isExchange = html.data.isExchange;
                        if (isExchange > 0) {
                            $.log(`打开任务页面 ${name} 机会今日剩余${userRemainingCount}次`);
                            if (name == "签到") {
                                if (userRemainingCount > 0) {
                                    await $.wait(1000); //等待1秒
                                    let activityUser_participate_body = {
                                        "code": `${code}`
                                    };
                                    await activityUser_participate(name, code, activityUser_participate_body, Referer);
                                } else {
                                    $.log(`打开任务页面 ${name} 今日已签到`);
                                }
                            } else if (name == "打地鼠") {
                                if (userRemainingCount > 0) {
                                    await $.wait(30000); //等待30秒
                                    let gameScore = (await random(60, 70) * 10);
                                    let activityUser_participate_body = {
                                        "code": code,
                                        "gameScore": `${gameScore}`,
                                        "gameSignature": md5(code + gameScore)
                                    };
                                    await activityUser_participate(name, code, activityUser_participate_body, Referer);
                                } else {
                                    $.log(`打开任务页面 ${name} 免费次数已用完 开启积分使用模式`);
                                    await $.wait(1000); //等待1秒
                                    let activityUser_partyExchange_body = {
                                        "code": `${code}`
                                    };
                                    await activityUser_partyExchange(name, code, activityUser_partyExchange_body, Referer);
                                }
                            }
                        } else {
                            $.log(`打开任务页面 ${name} 今日没有任务次数了`);
                        }
                    } else {
                        $.log(`打开任务页面 ${name} ${html.resultMsg}`);
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

//提交任务
async function activityUser_participate(name, code, activityUser_participate_body, Referer) {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/customerAth/activity-manage/activityUser/participate`,
            body: JSON.stringify(activityUser_participate_body),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                "Origin": "https://cps.hisense.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `${Referer}`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`提交任务 ${name} Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        let obtainScore = html.data.obtainScore;
                        $.log(`提交任务 ${name} 获得${obtainScore}积分`);
                        if (name == "打地鼠") {
                            await $.wait(1000); //等待1秒
                            await activityUser_getActivityInfo(name, code, Referer);
                        }
                    } else {
                        $.log(`提交任务 ${name} ${html.resultMsg}`);
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

//打地鼠使用积分
async function activityUser_partyExchange(name, code, activityUser_partyExchange_body, Referer) {
    return new Promise((resolve) => {
        let url = {
            url: `https://cps.hisense.com/customerAth/activity-manage/activityUser/partyExchange`,
            body: JSON.stringify(activityUser_partyExchange_body),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                "Origin": "https://cps.hisense.com",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": `${Referer}`,
                "Cookie": `${cps_Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打地鼠使用积分 ${name} Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        $.log(`打地鼠使用积分 ${name} 成功`);
                        await $.wait(30000); //等待30秒
                        let gameScore = (await random(60, 70) * 10);
                        let activityUser_participate_body = {
                            "code": code,
                            "gameScore": `${gameScore}`,
                            "gameSignature": md5(code + gameScore)
                        };
                        await activityUser_participate(name, code, activityUser_participate_body, Referer);
                    } else {
                        $.log(`打地鼠使用积分 ${name} ${html.resultMsg}`);
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
async function index_getTotalScore() {
    return new Promise((resolve) => {
        let url = {
            url: `https://jf.hisense.com/api/user-manage/userCenter/index/getTotalScore`,
            body: ``,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Accept": "*/*",
                "cch": getcch(),
                "Origin": "https://jf.hisense.com",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://jf.hisense.com/",
                "Cookie": `${jf_Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.resultCode == "00000") {
                        let data2 = html.data;
                        $.log(`查询积分 ${data2}积分`);
                    } else {
                        $.log(`查询积分 ${html.resultMsg}`);
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