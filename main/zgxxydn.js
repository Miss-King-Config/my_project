/*
这个修仙有点难app

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#这个修仙有点难
00 00 19,20,21,22,23 * * * , tag=这个修仙有点难, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 19,20,21,22,23 * * *" script-path=,tag=这个修仙有点难

===============Surge=================
这个修仙有点难 = type=cron,cronexp="00 00 19,20,21,22,23 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
这个修仙有点难 = type=cron,script-path=, cronexpr="00 00 19,20,21,22,23 * * *", timeout=33600, enable=true
*/

const $ = new Env('这个修仙有点难');
$.log(`需要新建环境变量: Zgxxydn_username_password_role_id\n填写抓包username----password----role_id\nZgxxydn_openid\n微信openid\nZgxxydn_word_desc\n红包口令\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [];
const md5key = "HGJL8-EDH5F-WS1JP-TFGJI";
var username = '';
var password = '';
var role_id = '';
var uuid = '';
var user_id = '';
var sdk_token = '';
var token = '';
var sign = '';
var config_id = '';
var openid = "";
var bind_code = "";
var role_name = '';
var server_id = '';
var servername = '';
var level = '';
var word_desc = "";
var receiveRed_int = false;

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
    const Zgxxydn_username_password_role_id = ($.isNode() ? (process.env.Zgxxydn_username_password_role_id) : ($.getval('Zgxxydn_username_password_role_id'))) || "";
    openid = ($.isNode() ? (process.env.Zgxxydn_openid) : ($.getval('Zgxxydn_openid'))) || "";
    word_desc = ($.isNode() ? (process.env.Zgxxydn_word_desc) : ($.getval('Zgxxydn_word_desc'))) || "";
    if (!Zgxxydn_username_password_role_id) {
        let str = Zgxxydn_username_password_role_id ? "" : "Zgxxydn_username_password_role_id";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Zgxxydn_username_password_role_id.indexOf('#') != -1) {
        appUrlArrs = Zgxxydn_username_password_role_id.split('#');
        $.log(`您选择的是用"#"隔开 Zgxxydn_username_password_role_id\n`);
    } else if (Zgxxydn_username_password_role_id.indexOf('\n') != -1) {
        appUrlArrs = Zgxxydn_username_password_role_id.split('\n');
        $.log(`您选择的是用"\\n"隔开 Zgxxydn_username_password_role_id\n`);
    } else if (Zgxxydn_username_password_role_id.indexOf('@') != -1) {
        appUrlArrs = Zgxxydn_username_password_role_id.split('@');
        $.log(`您选择的是用"@"隔开 Zgxxydn_username_password_role_id\n`);
    } else {
        appUrlArrs = [Zgxxydn_username_password_role_id];
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
        appUrlArrVal = appUrlArrVal.split("----");
        username = appUrlArrVal[0];
        password = appUrlArrVal[1];
        role_id = appUrlArrVal[2];
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        if (numUser == 0) {
            await getEnvParam(numUser);
            $.log(username);
            await user_login();
        } else {
            if (receiveRed_int) {
                await getEnvParam(numUser);
                $.log(username);
                await user_login();
            }
        }
    }
}

function object2str(t) {
    var a = [];
    for (var b in t) a.push(b + "=" + t[b]);
    return a.join("&");
}

function object2query(t) {
    var a = [];
    for (var b in t) a.push(b);
    a.sort();
    var c = [];
    for (var d in a) c.push(a[d] + "=" + t[a[d]]);
    return c.join("&");
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function Imei() {
    var imei = "863432" + random(100000000, 999999999);
    return imei;
}

//登录
async function user_login() {
    uuid = await Imei();
    var user_login_data = {
        ad_code: "pxzgxxydn_11194_63733_2477_222_1436954_ad",
        device: "1",
        dname: "ELE-AL00",
        game_id: "331",
        game_pkg: "yjsydlw_pxzgxxydn_CK",
        game_ver: "1",
        idfv: "",
        net_type: "NETWORK_WIFI",
        oaid: "",
        os_ver: "9",
        partner_id: "1",
        password: toMd5Hex(password),
        sdk_ver: "6.1.1.4",
        thirdextra: "",
        time: Date.now(),
        username: username,
        uuid: uuid
    };
    user_login_data.sign = toMd5Hex(object2query(user_login_data) + md5key);
    return new Promise((resolve) => {
        let url = {
            url: `https://sdk.sh9130.com/?method=user.login`,
            body: object2str(user_login_data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        user_id = data2.data.user_id;
                        token = data2.data.token;
                        sdk_token = data2.data.sdk_token;
                        $.log(`登录成功`);
                        await getHdUrl();
                    } else {
                        $.log(`登录` + data2.msg);
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

//getHdUrl
async function getHdUrl() {
    var TuiRedPack = {
        ad_code: "pxzgxxydn_11194_63733_2477_222_1436954_ad",
        device: "1",
        dname: "ELE-AL00",
        game_id: "331",
        game_pkg: "yjsydlw_pxzgxxydn_CK",
        game_ver: "1",
        idfv: "",
        net_type: "NETWORK_WIFI",
        oaid: "",
        os_ver: "9",
        partner_id: "1",
        role_id: role_id,
        sdk_token: sdk_token,
        sdk_ver: "6.1.1.4",
        thirdextra: "",
        time: Date.now(),
        uid: user_id,
        uuid: uuid
    };
    TuiRedPack.sign = toMd5Hex(object2query(TuiRedPack) + md5key);
    return new Promise((resolve) => {
        let url = {
            url: `https://sdk.sh9130.com/hd/?ct=TuiRedPack&ac=getHdUrl`,
            body: object2str(TuiRedPack),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`getHdUrl Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        sign = data2.data.sign;
                        config_id = data2.data.config_id;
                        $.log(`getHdUrl 获取sign成功`);
                        await getInfo2();
                    } else {
                        $.log(`getHdUrl` + data2.msg);
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

//getInfo2
async function getInfo2() {
    return new Promise((resolve) => {
        let url = {
            url: `https://xmr.shqnon.com/hd/?ac=getInfo2&config_id=${config_id}&ct=TuiRedPack&game_id=331&game_pkg=yjsydlw_pxzgxxydn_CK&hd_id=74&partner_id=1&role_id=${role_id}&sdk_token=${sdk_token}&sign=${sign}&uid=${user_id}&username=${username}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`getInfo2 Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        let is_bind_phone = data2.data.is_bind_phone;
                        let is_subscribe = data2.data.is_subscribe;
                        role_id = data2.data.role_info.role_id;
                        role_name = data2.data.role_info.role_name;
                        server_id = data2.data.role_info.server_id;
                        servername = data2.data.role_info.servername;
                        level = data2.data.role_info.level;
                        bind_code = data2.data.bind_code;
                        is_bind_phone == 1 ? $.log("已绑定手机号") : $.log("未绑定手机号");
                        is_subscribe == 1 ? $.log("已绑定微信") : $.log("未绑定微信");
                        if (is_subscribe == 0) await bindEntrance();
                        await getEntry();
                    } else {
                        $.log(`getInfo2 ` + data2.msg);
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

//bindEntrance
async function bindEntrance() {
    return new Promise((resolve) => {
        let url = {
            url: `https://sdk.sh9130.com/hd/?ct=TuiRedPack&ac=bindEntrance&openid=${openid}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`bindEntrance Api请求失败`);
                } else {
                    let data_url = resp.url;
                    let is_bind = data_url.substr(data_url.indexOf("is_bind=") + 8);
                    is_bind = is_bind.substr(0, is_bind.indexOf("&"));
                    if (is_bind == 1) {
                        let uidx = data_url.substr(data_url.indexOf("uid=") + 4);
                        uidx = uidx.substr(0, uidx.indexOf("&"));
                        await resetWxname(uidx);
                        await userBindThePulic();
                    } else {
                        await userBindThePulic();
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

//resetWxname
async function resetWxname(uidx) {
    return new Promise((resolve) => {
        let url = {
            url: `https://sdk.sh9130.com/hd/?ct=TuiRedPack&ac=resetWxname&uid=${uidx}&open_id=${openid}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`resetWxname Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        $.log(`resetWxname ` + data2.msg);
                    } else {
                        $.log(`resetWxname ` + data2.msg);
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

//userBindThePulic
async function userBindThePulic() {
    return new Promise((resolve) => {
        let url = {
            url: `https://sdk.sh9130.com/hd/?ct=tuiRedPack&ac=userBindThePulic&open_id=${openid}&bind_code=${bind_code}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`userBindThePulic Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        $.log(`userBindThePulic ` + data2.msg);
                    } else {
                        $.log(`userBindThePulic ` + data2.msg);
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

//getEntry
async function getEntry() {
    return new Promise((resolve) => {
        let url = {
            url: `https://xmr.shqnon.com/hd/?ct=TuiRedInteract&ac=getEntry&game_id=331&game_pkg=yjsydlw_pxzgxxydn_CK&role_id=${role_id}&uid=${user_id}&config_id=${config_id}&partner_id=1&sign=${sign}&sdk_token=${sdk_token}&username=${username}&hd_id=74&ad_code=pxzgxxydn_11194_63733_2477_222_1436954_ad`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`getEntry Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        config_id = data2.data.config_id;
                        sign = data2.data.sign;
                        await getIndex();
                    } else {
                        $.log(`getEntry ` + data2.msg);
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

//getIndex
async function getIndex() {
    return new Promise((resolve) => {
        let url = {
            url: `https://xmr.shqnon.com/hd/?ct=TuiRedInteract&ac=getIndex&game_id=331&game_pkg=yjsydlw_pxzgxxydn_CK&role_id=${role_id}&uid=${user_id}&config_id=${config_id}&sign=${sign}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`getIndex Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        let left_money = data2.data.left_money;
                        let red_data = data2.data.red_data;
                        for (let red_data_i in red_data) {
                            let status = red_data[red_data_i].status;
                            if (status == 1) {
                                let id = red_data[red_data_i].id;
                                await receiveRed(id);
                            }
                        }
                    } else {
                        $.log(`getIndex ` + data2.msg);
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

//receiveRed
async function receiveRed(id) {
    return new Promise((resolve) => {
        let url = {
            url: `https://xmr.shqnon.com/hd/?ct=TuiRedInteract&ac=receiveRed&game_id=331&game_pkg=yjsydlw_pxzgxxydn_CK&role_id=${role_id}&uid=${user_id}&config_id=${config_id}&sign=${sign}&red_id=${id}&role_name=${encodeURIComponent(role_name)}&word_desc=${word_desc}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`receiveRed Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.state == 1) {
                        $.log(`receiveRed ` + JSON.stringify(data2));
                        receiveRed_int = true;
                    } else {
                        $.log(`receiveRed ` + data2.msg);
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
                    url: url,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    url: url,
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
