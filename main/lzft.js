/*
lz飞天 微信小程序

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#lz飞天
0 0 6,10 * * *, tag=lz飞天, img-url=, enabled=true

================Loon==============
[Script]
cron "0 0 6,10 * * *" script-path=, tag=lz飞天

===============Surge=================
lz飞天 = type=cron, cronexp="0 0 6,10 * * *", wake-system=1, timeout=33600, script-path=

============小火箭=========
lz飞天 = type=cron, script-path=, cronexpr="0 0 6,10 * * *", timeout=33600, enable=true
*/

const $ = new Env('lz飞天');
$.log(`需要新建环境变量: Lzft_list\n填写抓包 userToken参数\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    userToken = "",
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160083 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wxda7924fb8811699c";

const sm4 = require("miniprogram-sm-crypto").sm4,
    sm4_key = "JeF38U9wT9wlMfs2";

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
    const Lzft_list = ($.isNode() ? (process.env.Lzft_list) : ($.getval('Lzft_list'))) || "";
    if (!Lzft_list) {
        let str = Lzft_list ? "" : "Lzft_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Lzft_list.indexOf('#') != -1) {
        appUrlArrs = Lzft_list.split('#');
        $.log(`您选择的是用"#"隔开 Lzft_list\n`);
    } else if (Lzft_list.indexOf('\n') != -1) {
        appUrlArrs = Lzft_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Lzft_list\n`);
    } else if (Lzft_list.indexOf('@') != -1) {
        appUrlArrs = Lzft_list.split('@');
        $.log(`您选择的是用"@"隔开 Lzft_list\n`);
    } else {
        appUrlArrs = [Lzft_list];
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
    userToken = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        x_forwarded_for = null;
        await X_Forwarded_For(); //虚拟IP
        await get_user_agent(); //虚拟UA
        await signIn_do();
        await $.wait(5000); //等待1秒
        await queryActivityUserInfoDetail();
        await $.wait(5000); //等待1秒
        await queryActivityUserInfoDetail();
        await $.wait(5000); //等待1秒
        await queryActivityUserInfoDetail();
        await $.wait(5000); //等待1秒
        await getCurLoginUser_do();
        await $.wait(5000); //等待1秒
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
    user_agent = "Mozilla/5.0 (Linux; Android " + await random(7, 14) + "; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160083 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0." + await random(15, 47) + ".2560(0x28002F51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wxda7924fb8811699c";
}

var sm4Util = function() {
    function ee() {}
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        r = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
        t = function(r) {
            var t, o, a, n, h, c;
            for (a = r.length, o = 0, t = ""; o < a;) {
                if (n = 255 & r.charCodeAt(o++), o == a) {
                    t += e.charAt(n >> 2), t += e.charAt((3 & n) << 4), t += "==";
                    break;
                }
                if (h = r.charCodeAt(o++), o == a) {
                    t += e.charAt(n >> 2), t += e.charAt((3 & n) << 4 | (240 & h) >> 4), t += e.charAt((15 & h) << 2),
                        t += "=";
                    break;
                }
                c = r.charCodeAt(o++), t += e.charAt(n >> 2), t += e.charAt((3 & n) << 4 | (240 & h) >> 4),
                    t += e.charAt((15 & h) << 2 | (192 & c) >> 6), t += e.charAt(63 & c);
            }
            return t;
        };
    ee.base64encode = t;
    var o = function(e) {
        var t, o, a, n, h, c, i;
        for (c = e.length, h = 0, i = ""; h < c;) {
            do {
                t = r[255 & e.charCodeAt(h++)];
            } while (h < c && -1 == t);
            if (-1 == t) break;
            do {
                o = r[255 & e.charCodeAt(h++)];
            } while (h < c && -1 == o);
            if (-1 == o) break;
            i += String.fromCharCode(t << 2 | (48 & o) >> 4);
            do {
                if (61 == (a = 255 & e.charCodeAt(h++))) return i;
                a = r[a];
            } while (h < c && -1 == a);
            if (-1 == a) break;
            i += String.fromCharCode((15 & o) << 4 | (60 & a) >> 2);
            do {
                if (61 == (n = 255 & e.charCodeAt(h++))) return i;
                n = r[n];
            } while (h < c && -1 == n);
            if (-1 == n) break;
            i += String.fromCharCode((3 & a) << 6 | n);
        }
        return i;
    };
    ee.base64decode = o;
    ee.hexToBase64 = function(e) {
        return t(String.fromCharCode.apply(null, e.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    };
    ee.base64ToHex = function(e) {
        for (var r = 0, t = o(e.replace(/[ \r\n]+$/, "")), a = []; r < t.length; ++r) {
            var n = t.charCodeAt(r).toString(16);
            1 === n.length && (n = "0" + n), a[a.length] = n;
        }
        return a.join("");
    };
    ee.utf8ToHex = function(e) {
        for (var r = (e = unescape(encodeURIComponent(e))).length, t = [], o = 0; o < r; o++) t[o >>> 2] |= (255 & e.charCodeAt(o)) << 24 - o % 4 * 8;
        for (var a = [], n = 0; n < r; n++) {
            var h = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
            a.push((h >>> 4).toString(16)), a.push((15 & h).toString(16));
        }
        return a.join("");
    };
    return ee;
}();

function sm4Encrypt(t) {
    var s = "";
    try {
        s = JSON.stringify(t);
    } catch (e) {
        console.log(e);
    }
    let o = sm4Util.utf8ToHex(sm4_key);
    var c = sm4.encrypt(s, o);
    return sm4Util.hexToBase64(c);
}

function sm4Decrypt(t) {
    var s = sm4Util.base64ToHex(t);
    let o = sm4Util.utf8ToHex(sm4_key);
    return sm4.decrypt(s, o);
}

//签到
async function signIn_do() {
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.member.api/userSignInPointMall/signIn.do?userToken=${userToken}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "*/*",
                "isOpenSecret": "1",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": `${user_agent}`,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        let prizeNum = data2.data.prizeNum;
                        $.log(`签到 获得${prizeNum}飞天币`);
                    } else {
                        $.log(`签到 ${data2.msg}`);
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

//打开拼图游戏页面
async function queryActivityUserInfoDetail() {
    let scriptJson = sm4Encrypt({
        "activityId": "345",
        "userToken": `${userToken}`
    });
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.activity.api/common/queryActivity/queryActivityUserInfoDetail?scriptJson=${scriptJson}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": `${user_agent}`,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开拼图游戏页面 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        let data3 = JSON.parse(sm4Decrypt(data2.data));
                        let useShare = data3.useShare;
                        let surplusFreeChance = data3.surplusFreeChance;
                        $.log(`打开拼图游戏页面 今日已分享${useShare}次 剩余拼图游戏${surplusFreeChance}次`);
                        if (useShare < 2) {
                            await $.wait(5000); //等待1秒
                            await activity_share();
                        }
                        if (surplusFreeChance > 0) {
                            await $.wait(5000); //等待1秒
                            await activity_openGame();
                        }
                    } else {
                        $.log(`打开拼图游戏页面 ${data2.msg}`);
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

//拼图游戏分享
async function activity_share() {
    let scriptJson = sm4Encrypt({
        "source": "20221019",
        "activityId": "345",
        "userToken": `${userToken}`
    });
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.activity.api/common/activity/share?scriptJson=${scriptJson}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": `${user_agent}`,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`拼图游戏分享 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        $.log(`拼图游戏分享 ${data2.msg}`);
                    } else {
                        $.log(`拼图游戏分享 ${data2.msg}`);
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

//开始拼图游戏
async function activity_openGame() {
    let scriptJson = sm4Encrypt({
        "activityId": "345",
        "userToken": `${userToken}`
    });
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.activity.api/common/activity/openGame`,
            body: `scriptJson=${scriptJson}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://gsgy.yunzhi.co",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://gsgy.yunzhi.co/gansu/gansu-pintu/active.html"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`开始拼图游戏 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        let data3 = JSON.parse(sm4Decrypt(data2.data));
                        let gameId = data3.gameId;
                        let maxScoreLimit = data3.maxScoreLimit;
                        await $.wait(10000); //等待10秒
                        await activity_endGame(maxScoreLimit, gameId);
                    } else {
                        $.log(`开始拼图游戏 ${data2.msg}`);
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

//结束拼图游戏
async function activity_endGame(maxScoreLimit, gameId) {
    let scriptJson = sm4Encrypt({
        "source": "20221019",
        "activityId": "345",
        "chanceSource": "free",
        "lat": "",
        "lng": "",
        "point": `${maxScoreLimit}`,
        "gameId": `${gameId}`,
        "userToken": `${userToken}`
    });
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.activity.api/common/activity/endGame`,
            body: `scriptJson=${scriptJson}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": `${user_agent}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://gsgy.yunzhi.co",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://gsgy.yunzhi.co/gansu/gansu-pintu/active.html"
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`结束拼图游戏 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        let data3 = JSON.parse(sm4Decrypt(data2.data));
                        let prizeValue = data3.prizeValue;
                        $.log(`结束拼图游戏 获得${prizeValue}飞天币`);
                    } else {
                        $.log(`结束拼图游戏 ${data2.msg}`);
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

//查询飞天币
async function getCurLoginUser_do() {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://gsgy.yunzhi.co/api/cloud2.member.api/member/userInfo/getCurLoginUser.do?userToken=${userToken}&t=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "charset": "utf-8",
                "isopensecret": "1",
                "x-auth-jwt": `${userToken}`,
                "User-Agent": `${user_agent}`,
                "content-type": "application/json",
                "accept": "application/json, text/plain, */*",
                "Referer": "https://servicewechat.com/wxda7924fb8811699c/40/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询飞天币 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.code == 200) {
                        let phone = data2.data.phone;
                        let pointValue = data2.data.pointValue;
                        $.log(`查询飞天币 手机号: ${phone} 总${pointValue}飞天币`);
                    } else {
                        $.log(`查询飞天币 ${data2.msg}`);
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