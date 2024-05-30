/*
微信小程序 英大人寿_种水果

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#英大人寿_种水果
00 00 9,14 * * * , tag=英大人寿_种水果, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 9,14 * * *" script-path=,tag=英大人寿_种水果

===============Surge=================
英大人寿_种水果 = type=cron,cronexp="00 00 9,14 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
英大人寿_种水果 = type=cron,script-path=, cronexpr="00 00 9,14 * * *", timeout=33600, enable=true
*/

const $ = new Env('英大人寿_种水果');
$.log(`需要新建环境变量: Ydrs_zsg_param\n填写抓包https://town.creakeweb.com/api\n请求提交数据param\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [];
var param_str = '';
var openid1 = '';
var openid2 = '';
var ApiToken = '';
var tree_id = '';

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
    const Ydrs_zsg_param = ($.isNode() ? (process.env.Ydrs_zsg_param) : ($.getval('Ydrs_zsg_param'))) || "";
    if (!Ydrs_zsg_param) {
        let str = Ydrs_zsg_param ? "" : "Ydrs_zsg_param";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Ydrs_zsg_param.indexOf('#') != -1) {
        appUrlArrs = Ydrs_zsg_param.split('#');
        $.log(`您选择的是用"#"隔开 Ydrs_zsg_param\n`);
    } else if (Ydrs_zsg_param.indexOf('\n') != -1) {
        appUrlArrs = Ydrs_zsg_param.split('\n');
        $.log(`您选择的是用"\\n"隔开 Ydrs_zsg_param\n`);
    } else if (Ydrs_zsg_param.indexOf('@') != -1) {
        appUrlArrs = Ydrs_zsg_param.split('@');
        $.log(`您选择的是用"@"隔开 Ydrs_zsg_param\n`);
    } else {
        appUrlArrs = [Ydrs_zsg_param];
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
    param_str = decodeURIComponent(appUrlArrVal);
    if (param_str != null && param_str != '') {
        let param_json = JSON.parse(Encrypt().decrypt_ecb(param_str));
        openid1 = param_json.openid1;
        openid2 = param_json.openid2;
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        await get_ApiToken();
        await $.wait(5000); //等待5秒
        await MemberTask_getLastestTree();
        await $.wait(5000); //等待5秒
        await MemberTask_allList();
        await $.wait(5000); //等待5秒
        await MemberFood_add();
        await $.wait(5000); //等待5秒
        await Prize_pointList();
        await $.wait(5000); //等待5秒
    }
}

//时间戳转日期时间
function filterTime() {
    let date = new Date();
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let GMT = Year + '-' + Moth + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Sechond;
    //let GMT = Hour + ':' + Minute + ':' + Sechond;
    return GMT;
}

function Encrypt() {
    var i = function() {
            function i() {}
            i.byteLength = function(e) {
                var t = f(e),
                    i = t[0],
                    n = t[1];
                return 3 * (i + n) / 4 - n;
            };
            i.toByteArray = function(e) {
                var t, i, n = f(e),
                    o = n[0],
                    s = n[1],
                    c = new a(u(0, o, s)),
                    d = 0,
                    l = s > 0 ? o - 4 : o;
                for (i = 0; i < l; i += 4) {
                    t = r[e.charCodeAt(i)] << 18 | r[e.charCodeAt(i + 1)] << 12 | r[e.charCodeAt(i + 2)] << 6 | r[e.charCodeAt(i + 3)];
                    c[d++] = t >> 16 & 255;
                    c[d++] = t >> 8 & 255;
                    c[d++] = 255 & t;
                }
                if (2 === s) {
                    t = r[e.charCodeAt(i)] << 2 | r[e.charCodeAt(i + 1)] >> 4;
                    c[d++] = 255 & t;
                }
                if (1 === s) {
                    t = r[e.charCodeAt(i)] << 10 | r[e.charCodeAt(i + 1)] << 4 | r[e.charCodeAt(i + 2)] >> 2;
                    c[d++] = t >> 8 & 255;
                    c[d++] = 255 & t;
                }
                return c;
            };
            i.fromByteArray = function(e) {
                for (var t, i = e.length, r = i % 3, a = [], o = 0, s = i - r; o < s; o += 16383) a.push(d(e, o, o + 16383 > s ? s : o + 16383));
                if (1 === r) {
                    t = e[i - 1];
                    a.push(n[t >> 2] + n[t << 4 & 63] + "==");
                } else if (2 === r) {
                    t = (e[i - 2] << 8) + e[i - 1];
                    a.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "=");
                }
                return a.join("");
            };
            for (var n = [], r = [], a = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, c = o.length; s < c; ++s) {
                n[s] = o[s];
                r[o.charCodeAt(s)] = s;
            }
            r["-".charCodeAt(0)] = 62;
            r["_".charCodeAt(0)] = 63;

            function f(e) {
                var t = e.length;
                if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var i = e.indexOf("="); - 1 === i && (i = t);
                return [i, i === t ? 0 : 4 - i % 4];
            }

            function u(e, t, i) {
                return 3 * (t + i) / 4 - i;
            }

            function d(e, t, i) {
                for (var r, a, o = [], s = t; s < i; s += 3) {
                    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]);
                    o.push(n[(a = r) >> 18 & 63] + n[a >> 12 & 63] + n[a >> 6 & 63] + n[63 & a]);
                }
                return o.join("");
            }
            return i;
        }(),
        n = function(r, a) {
            (null == a || a > r.length) && (a = r.length);
            for (var e = 0, n = new Array(a); e < a; e++) n[e] = r[e];
            return n;
        },
        t = ["test", "toByteArray", "length", "base64", "input", "map", "e7jGAcPO7ZTexYVH", "apply", "constructor", "init", "toString", "call", "split", "charCodeAt", "stateObject", "fromByteArray", "key", "slice", "debu", "string", "log", "reverse", "gger"],
        o = function(r, e) {
            return t[r -= 0]
        },
        a = [214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72],
        u = [462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257],
        f = [2746333894, 1453994832, 1736282519, 2993693404],
        l = function(r) {
            return /string/gi.test(Object.prototype[o("0xa")][o("0xb")](r)) || (r = JSON.stringify(r)), unescape(encodeURIComponent(r))[o("0xc")]("")[o("0x5")]((function(r) {
                return r[o("0xd")]()
            }))
        },
        p = function(r, e) {
            return r << e | r >>> 32 - e
        },
        s = function(r) {
            return a[r >>> 24 & 255] << 24 | a[r >>> 16 & 255] << 16 | a[r >>> 8 & 255] << 8 | a[255 & r]
        },
        x = function(r) {
            var e, n, t = [],
                o = [r[0] << 24 | r[1] << 16 | r[2] << 8 | r[3], r[4] << 24 | r[5] << 16 | r[6] << 8 | r[7], r[8] << 24 | r[9] << 16 | r[10] << 8 | r[11], r[12] << 24 | r[13] << 16 | r[14] << 8 | r[15]],
                c = new Array(36);
            c[0] = o[0] ^ f[0], c[1] = o[1] ^ f[1], c[2] = o[2] ^ f[2], c[3] = o[3] ^ f[3];
            for (var i = 0; i < 32; i++) c[i + 4] = c[i] ^ (e = c[i + 1] ^ c[i + 2] ^ c[i + 3] ^ u[i], n = void 0, (n = s(e)) ^ p(n, 13) ^ p(n, 23)), t[i] = c[i + 4];
            return t
        },
        v = function(r) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                n = [r[e] << 24 | r[e + 1] << 16 | r[e + 2] << 8 | r[e + 3], r[e + 4] << 24 | r[e + 5] << 16 | r[e + 6] << 8 | r[e + 7], r[e + 8] << 24 | r[e + 9] << 16 | r[e + 10] << 8 | r[e + 11], r[e + 12] << 24 | r[e + 13] << 16 | r[e + 14] << 8 | r[e + 15]];
            return n
        },
        d = function(r, e) {
            var n, t, o = new Array(36);
            r.forEach((function(r, e) {
                return o[e] = r
            }));
            for (var c = 0; c < 32; c++) o[c + 4] = o[c] ^ (n = o[c + 1] ^ o[c + 2] ^ o[c + 3] ^ e[c], t = void 0, (t = s(n)) ^ p(t, 2) ^ p(t, 10) ^ p(t, 18) ^ p(t, 24));
            return [o[35], o[34], o[33], o[32]]
        },
        g = function(r) {
            if (null === r) return null;
            var e = 16 - r[o("0x2")] % 16,
                n = new Array(r[o("0x2")] + e);
            return r.forEach((function(r, e) {
                return n[e] = r
            })), n.fill(e, r[o("0x2")]), n
        },
        y = function(r) {
            if (null === r) return null;
            var e = r[r.length - 1];
            return r[o("0x11")](0, r[o("0x2")] - e)
        },
        h = function(r, e) {
            return !(!e || 16 != e.length) || (console.error(r + " should be a 16 bytes string."), !1)
        };

    function encrypt_ecb(r) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o("0x6"), n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o("0x3"), t = x(l(e)), c = l(r), a = g(c), u = a[o("0x2")] / 16, f = [], p = 0; p < u; p++)
            for (var s = 16 * p, y = v(a, s), h = d(y, t), b = 0; b < 16; b++) f[s + b] = h[parseInt(b / 4)] >> (3 - b) % 4 * 8 & 255;
        return "base64" === n ? i[o("0xf")](f) : decodeURIComponent(escape(String.fromCharCode.apply(String, f)))
    }

    function decrypt_ecb(r) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "e7jGAcPO7ZTexYVH", t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o("0x3"), c = x(l(e))[o("0x15")](), a = null, u = (a = "base64" === t ? i.toByteArray(r) : l(r)).length / 16, f = [], p = 0; p < u; p++)
            for (var s = 16 * p, g = v(a, s), h = d(g, c), b = 0; b < 16; b++) f[s + b] = h[parseInt(b / 4)] >> (3 - b) % 4 * 8 & 255;
        var m = y(f);
        return decodeURIComponent(escape(String.fromCharCode.apply(String, n(m))))
    }

    return {
        encrypt_ecb: encrypt_ecb,
        decrypt_ecb: decrypt_ecb
    }
}

//获取ApiToken
async function get_ApiToken() {
    var param_string = encodeURIComponent(param_str);
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api`,
            body: `param=${param_string}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取ApiToken Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        ApiToken = html.data.api_token;
                    } else {
                        $.log("获取ApiToken " + html.msg);
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

//获取MemberTask_getLastestTree
async function MemberTask_getLastestTree() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberTree/getLastestTree`,
            body: ``,
            headers: {
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取MemberTask_getLastestTree Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        if (html.data) {
                            tree_id = html.data.id;
                        } else {
                            await MemberTree_add();
                        }
                    } else {
                        $.log("获取MemberTask_getLastestTree " + html.msg);
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

//获取MemberTree_add
async function MemberTree_add() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberTree/add`,
            body: ``,
            headers: {
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取MemberTree_add Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        tree_id = html.data.id;
                    } else {
                        $.log("获取MemberTree_add " + html.msg);
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

//获取任务列表
async function MemberTask_allList() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberTask/allList`,
            body: ``,
            headers: {
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取任务列表 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        var allList = html.data.allList;
                        for (let i = 0; i < allList.length; i++) {
                            var allList_list = allList[i];
                            if (allList_list.length > 0) {
                                var taskid = allList_list[0];
                                var title = allList_list[1];
                                var title_true = allList_list[5];
                                if (title_true == 0) {
                                    if (taskid == 1 || taskid == 7 || taskid == 8 || taskid == 9 || taskid == 16 || taskid == 17) {
                                        $.log(`获取任务列表 ${title} 任务无法完成`);
                                    } else if (taskid == 6) {
                                        await MemberSign_add();
                                        await $.wait(5000); //等待5秒
                                    } else if (taskid == 23) {
                                        await MemberTask_finishTask(title, taskid);
                                        await $.wait(5000); //等待5秒
                                    } else {
                                        get_taskreward(title, taskid)
                                        await $.wait(5000); //等待5秒
                                        await get_taskid(title, taskid);
                                        await $.wait(5000); //等待5秒
                                    }
                                } else if (title_true == 1) {
                                    $.log(`获取任务列表 ${title} 任务已完成`);
                                }
                            }
                        }
                    } else {
                        $.log("获取任务列表 " + html.msg);
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

//每日签到MemberSign_add
async function MemberSign_add() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberSign/add`,
            body: ``,
            headers: {
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`每日签到MemberSign_add Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        $.log("每日签到MemberSign_add " + html.msg);
                    } else {
                        $.log("每日签到MemberSign_add " + html.msg);
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
async function get_taskreward(title, taskid) {
    var param_string = encodeURIComponent(Encrypt().encrypt_ecb(JSON.stringify({
        "openid1": `${openid1}`,
        "openid2": `${openid2}`,
        "taskid": `${taskid}`,
        "remarks": "无"
    })));
    return new Promise((resolve) => {
        let url = {
            url: `https://wechat.ydthlife.com/SERVER/service.html?SERVERID=ydwx-taskreward`,
            body: `param=${param_string}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`提交任务 Api请求失败`);
                } else {
                    let html = JSON.parse(Encrypt().decrypt_ecb(data));
                    if (html.FLAG) {
                        var defmap = JSON.parse(html.defmap);
                        $.log(`提交任务 ${title} ${defmap.msg}`);
                    } else {
                        $.log(`提交任务 ${title}` + html.MESSAGE);
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

//完成任务
async function get_taskid(title, taskid) {
    var param_string = encodeURIComponent(Encrypt().encrypt_ecb(JSON.stringify({
        "openid1": `${openid1}`,
        "openid2": `${openid2}`,
        "nickname": "undefined",
        "userlabel1": "0",
        "userlabel2": "0",
        "userlabel3": "0",
        "userlabel4": "0",
        "userlabel5": "0",
        "userlabel6": "0",
        "source": "1",
        "taskid": `${taskid}`
    })));
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api`,
            body: `param=${param_string}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`完成任务 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        var food = html.data.food;
                        $.log(`完成任务 ${title} 肥料${food}`);
                    } else {
                        $.log(`完成任务 ${title}` + html.msg);
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

//提交MemberTask_finishTask
async function MemberTask_finishTask(title, taskid) {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberTask/finishTask`,
            body: `taskid=${taskid}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`提交MemberTask_finishTask Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        $.log(`提交MemberTask_finishTask ${title} 获得${html.data}肥料`);
                    } else {
                        $.log("提交MemberTask_finishTask " + html.msg);
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

//施肥MemberFood_add
async function MemberFood_add() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/MemberFood/add`,
            body: `tree_id=${tree_id}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`施肥MemberFood_add Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        var level = html.data.level;
                        var member_food = html.data.member_food;
                        var usable_integral = html.data.member.usable_integral;
                        $.log(`施肥MemberFood_add ${html.msg} 树${level}级 剩余肥料${member_food} 现有${usable_integral}幸福豆`);
                        await $.wait(5000); //等待5秒
                        await MemberFood_add();
                    } else {
                        $.log("施肥MemberFood_add " + html.msg);
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

//奖品列表
async function Prize_pointList() {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/Prize/pointList`,
            body: `sort_field=exchange_number&sort_value=desc`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`奖品列表 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        let data2 = html.data;
                        for (let i = 0; i < data2.length; i++) {
                            let prize_id = data2[i].prize_id;
                            let prize_name = data2[i].prize_name;
                            let prize_number = data2[i].prize_number;
                            let prize_type = data2[i].prize_type;
                            if (prize_id == 44 && prize_name == "电费红包20元" && prize_number > 0) {
                                await $.wait(5000); //等待5秒
                                await PrizeRecord_list(prize_id, prize_type);
                            }
                        }
                    } else {
                        $.log("奖品列表 " + html.msg);
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

//已兑换列表
async function PrizeRecord_list(prize_id, prize_type) {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/PrizeRecord/list`,
            body: `distribution_channel=2`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`已兑换列表 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        let data2 = html.data;
                        if (data2.length > 0) {
                            let user_name = data2[0].user_name;
                            let phone = data2[0].phone;
                            await $.wait(5000); //等待5秒
                            await PrizeRecord_addPointRecord(prize_id, prize_type, user_name, phone);
                        } else {
                            $.log("已兑换列表 没有兑换记录");
                        }
                    } else {
                        $.log("已兑换列表 " + html.msg);
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

//兑换
async function PrizeRecord_addPointRecord(prize_id, prize_type, user_name, phone) {
    return new Promise((resolve) => {
        let url = {
            url: `https://town.creakeweb.com/api/PrizeRecord/addPointRecord`,
            body: `user_name=${encodeURIComponent(user_name)}&phone=${phone}&prize_id=${prize_id}&awardtype=${prize_type}`,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "ApiToken": `${ApiToken}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`兑换 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        $.log("兑换 " + html.msg);
                    } else {
                        $.log("兑换 " + html.msg);
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

/** MD5
 * 加密 */
function toMd5Hex(text) {
    var hexcase = 0;
    var chrsz = 8;

    function core_md5(x, len) {
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }

    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    return binl2hex(core_md5(str2binl(text), text.length * chrsz));
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