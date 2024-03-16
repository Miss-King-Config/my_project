/*
微信公众号 凤悦酒店及度假村 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#凤悦酒店及度假村
00 00 05,10 * * * , tag=凤悦酒店及度假村, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 05,10 * * *" script-path=,tag=凤悦酒店及度假村

===============Surge=================
凤悦酒店及度假村 = type=cron,cronexp="00 00 05,10 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
凤悦酒店及度假村 = type=cron,script-path=, cronexpr="00 00 05,10 * * *", timeout=33600, enable=true
*/

const $ = new Env('凤悦酒店及度假村');
$.log(`需要新建环境变量: Fyjdjdjc_list\n填写抓包 凤悦酒店及度假村host-zd1.zhiketong.com的Cookie和桂元小程序host-api.anch168.com的authorization 格式Cookie----authorization\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    Cookie = "",
    authorization = "",
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android";

const CryptoJS = require("crypto-js"),
    md5key = "52F448E7AFECF1FE",
    appkey = "BFF1351752F448E7AFECF1FE0587EEAB";

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
    const Fyjdjdjc_list = ($.isNode() ? (process.env.Fyjdjdjc_list) : ($.getval('Fyjdjdjc_list'))) || "";
    if (!Fyjdjdjc_list) {
        let str = Fyjdjdjc_list ? "" : "Fyjdjdjc_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Fyjdjdjc_list.indexOf('#') != -1) {
        appUrlArrs = Fyjdjdjc_list.split('#');
        $.log(`您选择的是用"#"隔开 Fyjdjdjc_list\n`);
    } else if (Fyjdjdjc_list.indexOf('\n') != -1) {
        appUrlArrs = Fyjdjdjc_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Fyjdjdjc_list\n`);
    } else if (Fyjdjdjc_list.indexOf('@') != -1) {
        appUrlArrs = Fyjdjdjc_list.split('@');
        $.log(`您选择的是用"@"隔开 Fyjdjdjc_list\n`);
    } else {
        appUrlArrs = [Fyjdjdjc_list];
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
        Cookie = appUrlArrVal.split("----")[0];
        authorization = appUrlArrVal.split("----")[1];
        if (authorization.indexOf("Bearer") != -1) authorization = authorization.substr(authorization.indexOf("Bearer") + 6).trim();
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        x_forwarded_for = null;
        await X_Forwarded_For(); //虚拟IP
        await get_user_agent(); //虚拟UA
        await applet_list();
        await $.wait(1000); //等待1秒
        await getActivitySignInfo();
        await $.wait(1000); //等待1秒
        await operation_queryIndexAccountInfoApplet();
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
    user_agent = "Mozilla/5.0 (Linux; Android " + await random(7, 14) + "; ELE-AL00 Build/PQ3A." + await random(100000, 999999) + "." + await random(100, 999) + "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/" + await random(1000000, 9999999) + " MMWEBSDK/20231202 MMWEBID/" + await random(1000, 9999) + " MicroMessenger/8.0." + await random(20, 47) + "." + await random(1000, 9999) + "(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android";
}

async function getSigna(e, t, a) {
    var l = CryptoJS.MD5(t + e).toString();
    return (l = CryptoJS.MD5(l + a).toString()).toUpperCase();
}

//查询任务
async function applet_list() {
    let ts = Date.parse(new Date);
    let signa = await getSigna(ts, md5key, appkey);
    return new Promise((resolve) => {
        let url = {
            url: `https://api.anch168.com/2.0.0/api/point/obtain/task/applet/list`,
            body: JSON.stringify({}),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json;charset=utf-8",
                "signa": signa,
                "clienttype": "WAP",
                "charset": "utf-8",
                "terminal": "WAP",
                "version": "1.0.0",
                "app-name": "bj-point-prod",
                "authorization": `Bearer ${authorization}`,
                "appkey": `${appkey}`,
                "ts": `${ts}`,
                "Referer": `https://servicewechat.com/wxa5107802bfe79c74/99/page-frame.html`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询任务 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.resCode == 1) {
                        let resData = data2.resData;
                        for (let i in resData) {
                            let taskName = resData[i].taskName;
                            let taskCode = resData[i].taskCode;
                            let channel = resData[i].channel;
                            let recordStatus = resData[i].recordStatus;
                            if (taskName != "凤悦酒店订房") {
                                if (recordStatus == "") {
                                    await $.wait(1000); //等待1秒
                                    await applet_rewardTrigger(taskName, taskCode, channel);
                                } else {
                                    $.log(`查询任务 ${taskName} 今日已完成`);
                                }
                            } else {
                                $.log(`查询任务 ${taskName} 无法完成`);
                            }
                        }
                    } else {
                        $.log(`查询任务 ${data2.resMsg}`);
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

//执行任务
async function applet_rewardTrigger(taskName, taskCode, channel) {
    let ts = Date.parse(new Date);
    let signa = await getSigna(ts, md5key, appkey);
    return new Promise((resolve) => {
        let url = {
            url: `https://api.anch168.com/2.0.0/api/point/obtain/task/applet/rewardTrigger`,
            body: JSON.stringify({
                "taskCode": `${taskCode}`,
                "channel": `${channel}`
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json;charset=utf-8",
                "signa": signa,
                "clienttype": "WAP",
                "charset": "utf-8",
                "terminal": "WAP",
                "version": "1.0.0",
                "app-name": "bj-point-prod",
                "authorization": `Bearer ${authorization}`,
                "appkey": `${appkey}`,
                "ts": `${ts}`,
                "Referer": `https://servicewechat.com/wxa5107802bfe79c74/99/page-frame.html`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`执行任务 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.resCode == 1) {
                        $.log(`执行任务 ${taskName} ${data2.resMsg}`);
                    } else {
                        $.log(`执行任务 ${taskName} ${data2.resMsg}`);
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

//获取签到信息
async function getActivitySignInfo() {
    return new Promise((resolve) => {
        let url = {
            url: `https://zd1.zhiketong.com/NewHome/api?method=getActivitySignInfo&appid=wx6f7dd653b3f7dbb9&hid=213799&zkt_sign=1-ac25a27c74034cbff829ac7918a4c436&zkt_scene=sale&zkt_referrer=https%3A%2F%2Fzd9.zhiketong.com%2FCustomizesnapshot%2Fappid_wx6f7dd653b3f7dbb9%EF%BC%9Fid%3D222430%26appid%3Dwx6f7dd653b3f7dbb9%26platform%3Dwxa_home%26zkt_mini_type%3Dsaas%26zkt_mini_lifecycle%3Dlaunch%26from%3D1089%26reset_auth%3D1%26webviewTime%3D1710479990191%26launchTime%3D1710479988972&from=1089&platform=wxa_home&zkt_mini_type=saas&zkt_mini_lifecycle=show&tj_bm_customize_snapshot_id=222430&tj_bm_customize=1`,
            body: JSON.stringify({
                "args": {}
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取签到信息 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        let memberName = data2.data.memberName;
                        let activityId = data2.data.activityId;
                        await $.wait(1000); //等待1秒
                        await signInActivity(activityId, memberName);
                    } else {
                        $.log(`获取签到信息 失败`);
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
async function signInActivity(activityId, memberName) {
    return new Promise((resolve) => {
        let url = {
            url: `https://zd1.zhiketong.com/NewHome/api?method=signInActivity&appid=wx6f7dd653b3f7dbb9&hid=213799&zkt_sign=1-ac25a27c74034cbff829ac7918a4c436&zkt_scene=sale&zkt_referrer=https%3A%2F%2Fzd9.zhiketong.com%2FCustomizesnapshot%2Fappid_wx6f7dd653b3f7dbb9%EF%BC%9Fid%3D222430%26appid%3Dwx6f7dd653b3f7dbb9%26platform%3Dwxa_home%26zkt_mini_type%3Dsaas%26zkt_mini_lifecycle%3Dlaunch%26from%3D1089%26reset_auth%3D1%26webviewTime%3D1710479990191%26launchTime%3D1710479988972&from=1089&platform=wxa_home&zkt_mini_type=saas&zkt_mini_lifecycle=show&tj_bm_customize_snapshot_id=222430&tj_bm_customize=1`,
            body: JSON.stringify({
                "args": {
                    "activityId": `${activityId}`,
                    "memberName": `${memberName}`
                }
            }),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json",
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.success) {
                        if (html.data.success) {
                            $.log(`签到 成功`);
                        } else {
                            $.log(`签到 ${html.data.message}`);
                        }
                    } else {
                        $.log(`签到 失败`);
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
async function operation_queryIndexAccountInfoApplet() {
    let ts = Date.parse(new Date);
    let signa = await getSigna(ts, md5key, appkey);
    return new Promise((resolve) => {
        let url = {
            url: `https://api.anch168.com/2.0.0/api/point/operation/queryIndexAccountInfoApplet`,
            body: JSON.stringify({}),
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/json;charset=utf-8",
                "signa": signa,
                "clienttype": "WAP",
                "charset": "utf-8",
                "terminal": "WAP",
                "version": "1.0.0",
                "app-name": "bj-point-prod",
                "authorization": `Bearer ${authorization}`,
                "appkey": `${appkey}`,
                "ts": `${ts}`,
                "Referer": `https://servicewechat.com/wxa5107802bfe79c74/99/page-frame.html`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.resCode == 1) {
                        let accountBalance = data2.resData.accountBalance;
                        $.log(`查询积分 总${accountBalance}积分`);
                    } else {
                        $.log(`查询积分 ${data2.resMsg}`);
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