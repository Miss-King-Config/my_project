/*
微信公众号 恭胜汇 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#恭胜汇
00 00 12,18 * * * , tag=恭胜汇, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 12,18 * * *" script-path=,tag=恭胜汇

===============Surge=================
恭胜汇 = type=cron,cronexp="00 00 12,18 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
恭胜汇 = type=cron,script-path=, cronexpr="00 00 12,18 * * *", timeout=33600, enable=true
*/

const $ = new Env('恭胜汇');
$.log(`需要新建环境变量: Gsh_list\n填写抓包 post请求http://m.99inn.cc/Index/GetDuiba的membercard\n多用户可以用"#" "@" "\\n" 隔开`);

window = {};

var appUrlArr = [],
    membercard = "",
    Cookie = "",
    index_location = "",
    x_forwarded_for = null;

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
    const Gsh_list = ($.isNode() ? (process.env.Gsh_list) : ($.getval('Gsh_list'))) || "";
    if (!Gsh_list) {
        let str = Gsh_list ? "" : "Gsh_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Gsh_list.indexOf('#') != -1) {
        appUrlArrs = Gsh_list.split('#');
        $.log(`您选择的是用"#"隔开 Gsh_list\n`);
    } else if (Gsh_list.indexOf('\n') != -1) {
        appUrlArrs = Gsh_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Gsh_list\n`);
    } else if (Gsh_list.indexOf('@') != -1) {
        appUrlArrs = Gsh_list.split('@');
        $.log(`您选择的是用"@"隔开 Gsh_list\n`);
    } else {
        appUrlArrs = [Gsh_list];
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
    membercard = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        $.log(`账号: ${membercard}`);
        x_forwarded_for = null;
        await X_Forwarded_For();
        await GetDuiba();
        await $.wait(1000); //等待1秒
        await signactivity_index();
        await $.wait(1000); //等待1秒
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

//跳转登录
async function GetDuiba() {
    return new Promise((resolve) => {
        let url = {
            url: `http://m.99inn.cc/Index/GetDuiba`,
            body: `membercard=${membercard}&scope=0&pageType=2`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": `http://m.99inn.cc/Index/Index`,
                "Cookie": ``
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`跳转登录 Api请求失败`);
                } else {
                    let data2 = JSON.parse(JSON.parse(data));
                    if (data2.Result) {
                        let autologin_url = data2.Data;
                        await autoLogin_autologin(autologin_url);
                    } else {
                        $.log(`跳转登录${data2.Msg}`);
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

//获取Cookie
async function autoLogin_autologin(autologin_url) {
    return new Promise((resolve) => {
        let url = {
            url: `${autologin_url}`,
            followRedirect: false,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Referer": `http://m.99inn.cc/`,
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
                        s3 += s2.substring(0, s2.indexOf(";") + 2);
                    }
                    Cookie = s3;
                    index_location = resp.headers['location'];
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
async function signactivity_index() {
    return new Promise((resolve) => {
        let url = {
            url: `${index_location}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Referer": `http://m.99inn.cc/`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开签到页面Api请求失败`);
                } else {
                    let html = data;
                    let CFG2 = html.substring(html.indexOf("var CFG = "));
                    CFG2 = CFG2.substring(0, CFG2.indexOf(';') + 1);
                    eval(CFG2);
                    let id = CFG.id;
                    await $.wait(1000); //等待1秒
                    await signactivity_doSign(id);
                    await $.wait(1000); //等待1秒
                    await signactivity_getSignInfo(id);
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
async function signactivity_doSign(id) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://53946.activity-13.m.duiba.com.cn/signactivity/doSign?id=${id}&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Referer": `${index_location}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        let logId = data2.logId;
                        await $.wait(1000); //等待1秒
                        await signactivity_getSignResult(logId);
                    } else {
                        $.log(`签到 今日已签到`);
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
async function signactivity_getSignResult(logId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://53946.activity-13.m.duiba.com.cn/signactivity/getSignResult?_=${timestamp}`,
            body: `logId=${logId}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `${index_location}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到结果 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.status == 2) {
                        let addCredits = data2.addCredits;
                        $.log(`签到结果 获得${addCredits}积分`);
                    } else {
                        $.log(`签到结果 失败`);
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
async function signactivity_getSignInfo(id) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://53946.activity-13.m.duiba.com.cn/signactivity/getSignInfo?_=${timestamp}`,
            body: `signActivityId=${id}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `${index_location}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        let credits = data2.credits;
                        $.log(`查询积分 总${credits}积分`);
                    } else {
                        $.log(`查询积分 失败`);
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