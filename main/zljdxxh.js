/*
中旅酒店心享会 签到

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#中旅酒店心享会
00 00 04,06 * * * , tag=中旅酒店心享会, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 04,06 * * *" script-path=,tag=中旅酒店心享会

===============Surge=================
中旅酒店心享会 = type=cron,cronexp="00 00 04,06 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
中旅酒店心享会 = type=cron,script-path=, cronexpr="00 00 04,06 * * *", timeout=33600, enable=true
*/

const $ = new Env('中旅酒店心享会');
$.log(`需要新建环境变量: Zljdxxh_list\n填写抓包mtmall-token\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    mtmall_token = "",
    Cookie = "",
    cookie_url = "",
    qd_boolean = false;

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
    const Zljdxxh_list = ($.isNode() ? (process.env.Zljdxxh_list) : ($.getval('Zljdxxh_list'))) || "";
    if (!Zljdxxh_list) {
        let str = Zljdxxh_list ? "" : "Zljdxxh_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Zljdxxh_list.indexOf('#') != -1) {
        appUrlArrs = Zljdxxh_list.split('#');
        $.log(`您选择的是用"#"隔开 Zljdxxh_list\n`);
    } else if (Zljdxxh_list.indexOf('\n') != -1) {
        appUrlArrs = Zljdxxh_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Zljdxxh_list\n`);
    } else if (Zljdxxh_list.indexOf('@') != -1) {
        appUrlArrs = Zljdxxh_list.split('@');
        $.log(`您选择的是用"@"隔开 Zljdxxh_list\n`);
    } else {
        appUrlArrs = [Zljdxxh_list];
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
    mtmall_token = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        qd_boolean = false;
        await getDuiBaSign();
        await $.wait(1000); //等待1秒
        await getAuthUrlByPhone();
        await $.wait(1000); //等待1秒
        await signInRecord();
        await $.wait(1000); //等待1秒
        await personalInfo();
        await $.wait(1000); //等待1秒
    }
}

//获取cookie url
async function getDuiBaSign() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mt.h-world.com/mallapi/member/getDuiBaSign`,
            headers: {
                "charset": "utf-8",
                "storecodetype": "miniapp",
                "channel": "wechat",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                "storecode": "3DA81C5DE5F8AEA2",
                "storecodeapplet": "3DA81C5DE5F8AEA2",
                "supplier": "3DA81C5DE5F8AEA2",
                "content-type": "application/json",
                "mthotel-token": `${mtmall_token}`,
                "mtmall-token": `${mtmall_token}`,
                "Referer": "https://servicewechat.com/wx742ae5182f53fe64/79/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取cookie url Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        cookie_url = html.result;
                        await $.wait(1000); //等待1秒
                        await app_index_html(cookie_url);
                    } else {
                        $.log(`获取cookie url ${html.message}`);
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

//获取cookie
async function app_index_html(cookie_url) {
    return new Promise((resolve) => {
        let url = {
            url: `https://hpr-applet.ctgh.com/app-vue/app/index.html?${cookie_url}`,
            headers: {
                "upgrade-insecure-requests": "1",
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F50) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx742ae5182f53fe64",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/wxpic,image/tpg,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "none",
                "sec-fetch-mode": "navigate",
                "sec-fetch-user": "?1",
                "sec-fetch-dest": "document",
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取cookie Api请求失败`);
                } else {
                    let set_cookie = resp.headers["set-cookie"];
                    let set_cookie2 = [];
                    for (let i in set_cookie) {
                        let set_cookie3 = set_cookie[i];
                        set_cookie3 = set_cookie3.substr(0, set_cookie3.indexOf(";"));
                        set_cookie2.push(set_cookie3);
                    }
                    Cookie = set_cookie2.join(";");
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取authCode
async function getAuthUrlByPhone() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mt.h-world.com/mallapi/member/getAuthUrlByPhone`,
            headers: {
                "charset": "utf-8",
                "storecodetype": "miniapp",
                "channel": "wechat",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                "storecode": "3DA81C5DE5F8AEA2",
                "storecodeapplet": "3DA81C5DE5F8AEA2",
                "supplier": "3DA81C5DE5F8AEA2",
                "content-type": "application/json",
                "mthotel-token": `${mtmall_token}`,
                "mtmall-token": `${mtmall_token}`,
                "Referer": "https://servicewechat.com/wx742ae5182f53fe64/79/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取authCode Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        let authCode = html.result;
                        await $.wait(1000); //等待1秒
                        await getTokenByAuthCodeForH5(authCode);
                    } else {
                        $.log(`获取authCode ${html.message}`);
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

//获取积分记录token
async function getTokenByAuthCodeForH5(authCode) {
    let time = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://hpr-applet.ctgh.com/app/json/ctgh_app_login/getTokenByAuthCodeForH5?ver=${time}`,
            body: "jsonData=" + encodeURIComponent(JSON.stringify({
                "deviceId": "",
                "city": "",
                "province": "",
                "ipAddress": "",
                "channel": null,
                "confId": "",
                "longitude": "",
                "latitude": "",
                "platformChannel": "3",
                "token": "",
                "authCode": `${authCode}`
            })),
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F50) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx742ae5182f53fe64",
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "origin": "https://hpr-applet.ctgh.com",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "referer": `https://hpr-applet.ctgh.com/app-vue/app/index.html?${cookie_url}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取积分记录token Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.status == 0) {
                        let token = JSON.parse(html.data).data.token;
                        await $.wait(1000); //等待1秒
                        await getAccountPaymentList(token);
                    } else {
                        $.log(`获取积分记录token ${html.info}`);
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

//获取积分记录
async function getAccountPaymentList(token) {
    let time = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://hpr-applet.ctgh.com/app/json/acct/getAccountPaymentList?ver=${time}`,
            body: "jsonData=" + encodeURIComponent(JSON.stringify({
                "deviceId": "",
                "city": "",
                "province": "",
                "ipAddress": "",
                "channel": null,
                "confId": "",
                "longitude": "",
                "latitude": "",
                "platformChannel": "3",
                "token": `${token}`,
                "page": {
                    "index": 1,
                    "pageSize": 10
                },
                "acctType": 3,
                "payTypeCodes": "100,200,300,400,900,110,120"
            })),
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F50) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx742ae5182f53fe64",
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "origin": "https://hpr-applet.ctgh.com",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "referer": `https://hpr-applet.ctgh.com/app-vue/app/index.html?${cookie_url}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取积分记录 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.status == 0) {
                        var paidTime = html.data[0].paidTime;
                        paidTime = paidTime.replace(/-/g, "/");
                        var date = Date.parse(new Date());
                        var date2 = Date.parse(new Date(paidTime));
                        if (date - date2 > 36 * 60 * 60 * 1000) {
                            qd_boolean = true;
                            $.log(`获取积分记录 36小时内未签到`);
                        } else {
                            qd_boolean = false;
                            $.log(`获取积分记录 36小时内已签到`);
                        }
                    } else {
                        $.log(`获取积分记录 ${html.info}`);
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

//检测签到
async function signInRecord() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mt.h-world.com/hotelapi/activity/signInRecord`,
            body: ``,
            headers: {
                "charset": "utf-8",
                "storecodetype": "miniapp",
                "channel": "wechat",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                "storecode": "3DA81C5DE5F8AEA2",
                "storecodeapplet": "3DA81C5DE5F8AEA2",
                "supplier": "3DA81C5DE5F8AEA2",
                "Content-Type": "application/x-www-form-urlencoded",
                "mthotel-token": `${mtmall_token}`,
                "mtmall-token": `${mtmall_token}`,
                "Referer": "https://servicewechat.com/wx742ae5182f53fe64/79/page-frame.html"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`检测签到 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        let signRewordList = html.result.signRewordList;
                        if (signRewordList[0].point == signRewordList[1].point && !qd_boolean) {
                            $.log(`检测签到 积分变换间隔1天签到`);
                        } else {
                            await $.wait(1000); //等待1秒
                            await signIn();
                        }
                    } else {
                        $.log(`检测签到 ${html.message}`);
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
async function signIn() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mt.h-world.com/hotelapi/activity/signIn`,
            body: ``,
            headers: {
                "charset": "utf-8",
                "storecodetype": "miniapp",
                "channel": "wechat",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                "storecode": "3DA81C5DE5F8AEA2",
                "storecodeapplet": "3DA81C5DE5F8AEA2",
                "supplier": "3DA81C5DE5F8AEA2",
                "Content-Type": "application/x-www-form-urlencoded",
                "mthotel-token": `${mtmall_token}`,
                "mtmall-token": `${mtmall_token}`,
                "Referer": "https://servicewechat.com/wx742ae5182f53fe64/79/page-frame.html"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        let text = html.result.text;
                        $.log(`签到 ${text}`);
                    } else {
                        $.log(`签到 ${html.message}`);
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
async function personalInfo() {
    return new Promise((resolve) => {
        let url = {
            url: `https://mt.h-world.com/mallapi/member/personalInfo`,
            headers: {
                "charset": "utf-8",
                "storecodetype": "miniapp",
                "channel": "wechat",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                "storecode": "3DA81C5DE5F8AEA2",
                "storecodeapplet": "3DA81C5DE5F8AEA2",
                "supplier": "3DA81C5DE5F8AEA2",
                "content-type": "application/json",
                "mthotel-token": `${mtmall_token}`,
                "mtmall-token": `${mtmall_token}`,
                "Referer": "https://servicewechat.com/wx742ae5182f53fe64/79/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询积分 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        var point = html.result.memberProfile.point;
                        $.log(`查询积分 总${point}积分`);
                    } else {
                        $.log(`查询积分 ${html.message}`);
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