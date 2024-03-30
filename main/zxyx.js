/*
微信公众号 中信优享+

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#中信优享+
00 00 01,07,13,19 * * * , tag=中信优享+, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 01,07,13,19 * * *" script-path=,tag=中信优享+

===============Surge=================
中信优享+ = type=cron,cronexp="00 00 01,07,13,19 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
中信优享+ = type=cron,script-path=, cronexpr="00 00 01,07,13,19 * * *", timeout=33600, enable=true
*/

const $ = new Env('中信优享+');
$.log(`需要新建环境变量: Zxyx_list\n填写 账号----密码\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    phone = "",
    passWord = "",
    Authorization = "",
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64";

const CryptoJS = require("crypto-js");

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
    const Zxyx_list = ($.isNode() ? (process.env.Zxyx_list) : ($.getval('Zxyx_list'))) || "";
    if (!Zxyx_list) {
        let str = Zxyx_list ? "" : "Zxyx_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Zxyx_list.indexOf('#') != -1) {
        appUrlArrs = Zxyx_list.split('#');
        $.log(`您选择的是用"#"隔开 Zxyx_list\n`);
    } else if (Zxyx_list.indexOf('\n') != -1) {
        appUrlArrs = Zxyx_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Zxyx_list\n`);
    } else if (Zxyx_list.indexOf('@') != -1) {
        appUrlArrs = Zxyx_list.split('@');
        $.log(`您选择的是用"@"隔开 Zxyx_list\n`);
    } else {
        appUrlArrs = [Zxyx_list];
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
        passWord = appUrlArrVal.split("----")[1];
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        x_forwarded_for = null;
        await X_Forwarded_For(); //虚拟IP
        await get_user_agent(); //虚拟UA
        await lmUserLoginByCipher();
        await $.wait(1000); //等待1秒
        await user_sign_fodder();
        await $.wait(1000); //等待1秒
        await task_task_list();
        await $.wait(1000); //等待1秒
        await duck_feed_duck();
        await $.wait(1000); //等待1秒
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
    user_agent = "Mozilla/5.0 (Linux; Android " + await random(7, 14) + "; ELE-AL00 Build/PQ3A." + await random(100000, 999999) + "." + await random(100, 999) + "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/" + await random(1000000, 9999999) + " MMWEBSDK/20231202 MMWEBID/" + await random(1000, 9999) + " MicroMessenger/8.0." + await random(20, 47) + "." + await random(1000, 9999) + "(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64";
}

//登录
async function lmUserLoginByCipher() {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/authServer/app/login/lmUserLoginByCipher`,
            body: JSON.stringify({
                "channelId": "e5abe0293b434e4c86ee406a371509a5",
                "phone": `${phone}`,
                "passWord": CryptoJS.MD5(`${passWord}`).toString()
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "application/json, text/plain, */*",
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "X-Requested-With": "com.tencent.mm",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.statusCode == 200) {
                        let access_token = data2.data.access_token;
                        await $.wait(1000); //等待1秒
                        await user_login(access_token);
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

//获取Authorization
async function user_login(access_token) {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/user/login`,
            body: JSON.stringify({
                "accessToken": `${access_token}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取Authorization Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        Authorization = data2.data.token;
                        await $.wait(1000); //等待1秒
                        await user_getUidEncode();
                    } else {
                        $.log(`获取Authorization ${data2.retMsg}`);
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

//user/getUidEncode
async function user_getUidEncode() {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/user/getUidEncode?t=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`user/getUidEncode Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        $.log(`user/getUidEncode ${data2.retMsg}`);
                    } else {
                        $.log(`user/getUidEncode ${data2.retMsg}`);
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
async function user_sign_fodder() {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/user/sign-fodder`,
            body: ``,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        let continuousCount = data2.data.continuousCount;
                        let fodderCount = data2.data.fodderCount;
                        $.log(`签到 获得${continuousCount}饲料 总${fodderCount}饲料`);
                    } else {
                        $.log(`签到 ${data2.retMsg}`);
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
async function task_task_list() {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/task/task-list?taskType=FODDER&t=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开任务列表 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        let task_task_list_data = data2.data;
                        for (let i in task_task_list_data) {
                            let taskCode = task_task_list_data[i].taskCode;
                            let taskName = task_task_list_data[i].taskName;
                            let taskStatus = task_task_list_data[i].taskStatus;
                            if (taskStatus == 0) {
                                await $.wait(1000); //等待1秒
                                await task_update_status(taskCode, taskName);
                            } else if (taskStatus == 1) {
                                await $.wait(1000); //等待1秒
                                await fodder_draw_fodder(taskCode, taskName);
                            } else if (taskStatus == 2) {
                                $.log(`打开任务列表 ${taskName} 已完成`);
                            }
                        }
                    } else {
                        $.log(`打开任务列表 ${data2.retMsg}`);
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

//去完成
async function task_update_status(taskCode, taskName) {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/task/update-status`,
            body: JSON.stringify({
                "taskCode": `${taskCode}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`去完成 ${taskName} Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        $.log(`去完成 ${taskName} ${data2.retMsg}`);
                    } else {
                        $.log(`去完成 ${taskName} ${data2.retMsg}`);
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

//去领取
async function fodder_draw_fodder(taskCode, taskName) {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/fodder/draw-fodder`,
            body: JSON.stringify({
                "taskCode": `${taskCode}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`去领取 ${taskName} Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        let buttonDesc = data2.data.buttonDesc;
                        let fodderCount = data2.data.fodderCount;
                        $.log(`去领取 ${taskName} ${buttonDesc} 总${fodderCount}饲料`);
                    } else {
                        $.log(`去领取 ${taskName} ${data2.retMsg}`);
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

//喂养
async function duck_feed_duck() {
    return new Promise((resolve) => {
        let url = {
            url: `https://apiwealthplaza.cfhc.citic/enjoyplus-yaya/business/duck/feed-duck`,
            body: JSON.stringify({
                "inviteCode": "",
                "taskCode": "",
                "inviteDate": ""
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
                "Authorization": `${Authorization}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Origin": "https://wealthplaza.cfhc.citic",
                "Sec-Fetch-Site": "same-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://wealthplaza.cfhc.citic/",
                "Cookie": ""
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`喂养 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.retCode == "00000000") {
                        let fodderCount = data2.data.fodderCount;
                        $.log(`喂养 成功 总${fodderCount}饲料`);
                    } else {
                        $.log(`喂养 ${data2.retMsg}`);
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