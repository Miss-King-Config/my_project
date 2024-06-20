/*
微信 公众号明宇酒店 签到抽奖

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#明宇酒店
00 00 8,10 * * * , tag=明宇酒店, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 8,10 * * *" script-path=,tag=明宇酒店

===============Surge=================
明宇酒店 = type=cron,cronexp="00 00 8,10 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
明宇酒店 = type=cron,script-path=, cronexpr="00 00 8,10 * * *", timeout=33600, enable=true
*/

const $ = new Env('明宇酒店');
$.log(`需要新建环境变量: Myjd_list\n填写小程序api.wx.gcihotel.net抓包openid\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [],
    x_forwarded_for = null,
    user_agent = "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/6490 MicroMessenger/8.0.47.2560(0x28002F3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
    openid = null,
    memberToken = null,
    token = null,
    Cookie = null;

const appkey = "40198222",
    appsecret = "8201F7C41C5811EDB61AC18A5B1827D9",
    crypto = require('crypto');

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
    const Myjd_list = ($.isNode() ? (process.env.Myjd_list) : ($.getval('Myjd_list'))) || "";
    if (!Myjd_list) {
        let str = Myjd_list ? "" : "Myjd_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Myjd_list.indexOf('#') != -1) {
        appUrlArrs = Myjd_list.split('#');
        $.log(`您选择的是用"#"隔开 Myjd_list\n`);
    } else if (Myjd_list.indexOf('\n') != -1) {
        appUrlArrs = Myjd_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Myjd_list\n`);
    } else if (Myjd_list.indexOf('@') != -1) {
        appUrlArrs = Myjd_list.split('@');
        $.log(`您选择的是用"@"隔开 Myjd_list\n`);
    } else {
        appUrlArrs = [Myjd_list];
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
    openid = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        x_forwarded_for = null;
        await X_Forwarded_For(); //虚拟IP
        await get_user_agent(); //虚拟UA
        await memberLoginOpen();
        await $.wait(1000); //等待1秒
        await getToken_json();
        await $.wait(1000); //等待1秒
        await miniAppAutoLogin();
        await $.wait(1000); //等待1秒
        await sign_component_page("266950778960342");
        await $.wait(2000); //等待2秒
        //1积分转好礼 2次
        await hdtool_index("206347762920931");
        await $.wait(2000); //等待2秒
        await hdtool_index("206347762920931");
        await $.wait(2000); //等待2秒
        await ctool_getCredits("266950778960342");
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

async function object_query(t) {
    var a = [];
    for (var b in t) a.push(b);
    a.sort();
    var c = [];
    for (var d in a) c.push(a[d] + "=" + t[a[d]]);
    return c.join("&");
}

async function get_signature(method, accept, content_md5, content_type, x_gw_key, x_gw_nonce, x_gw_timestamp, url) {
    let O = "".concat(method, "\n").concat(accept || "*/*", "\n").concat(content_md5, "\n").concat(content_type, "\n\n").concat(`x-gw-key:${x_gw_key}`, "\n").concat(`x-gw-nonce:${x_gw_nonce}`, "\n").concat(`x-gw-timestamp:${x_gw_timestamp}`, "\n").concat(decodeURIComponent(url));
    let hmac = crypto.createHmac('sha256', appsecret);
    hmac.update(O);
    return hmac.digest('base64');
}

//获取memberToken
async function memberLoginOpen() {
    let memberLoginOpen_data = {
        hotelCode: "0",
        hotelGroupCode: "MYSLG",
        hotelGroupId: "2",
        openid: `${openid}`,
        appid: "wx55fa79a0df611abd",
        componentAppid: "wxe715bd146a4e468b"
    };
    memberLoginOpen_data = await object_query(memberLoginOpen_data);
    let content_md5 = "";
    let x_gw_key = appkey;
    let x_gw_nonce = await random(1e12, 9999999999999);
    let x_gw_timestamp = Date.now();
    let x_gw_signature = await get_signature("GET", "*/*", content_md5, "application/json", x_gw_key, x_gw_nonce, x_gw_timestamp, `/guardian/api/member/memberLoginOpen.json?${memberLoginOpen_data}`);
    return new Promise((resolve) => {
        let url = {
            url: `https://api.wx.gcihotel.net/guardian/api/member/memberLoginOpen.json?${memberLoginOpen_data}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "x-gw-signature-headers": "x-gw-key,x-gw-nonce,x-gw-timestamp",
                "charset": "utf-8",
                "x-gw-timestamp": x_gw_timestamp,
                "x-gw-nonce": x_gw_nonce,
                "User-Agent": user_agent,
                "content-type": "application/json",
                "x-gw-key": x_gw_key,
                "x-gw-signature": x_gw_signature,
                "accept": "*/*",
                "Referer": "https://servicewechat.com/wx55fa79a0df611abd/36/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取memberToken Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.result == 1) {
                        memberToken = html.retVal.memberToken;
                    } else {
                        $.log("获取memberToken " + html.msg);
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
async function getToken_json() {
    let getToken_data = {
        appid: "wx55fa79a0df611abd",
        headPortraitUrl: `https://thirdwx.qlogo.cn/mmopen/vi_32/vkCKtILicCicQiavYBfELHjOZWQcZlISE4jBl5pq4GiavlJh8AUPhrnMQhn6bq0KS7Z7nzJGFJvibgcxoglbFzQx8oA/132`,
        memberToken: `${memberToken}`
    };
    getToken_data = await object_query(getToken_data);
    let content_md5 = "";
    let x_gw_key = appkey;
    let x_gw_nonce = await random(1e12, 9999999999999);
    let x_gw_timestamp = Date.now();
    let x_gw_signature = await get_signature("GET", "*/*", content_md5, "application/json", x_gw_key, x_gw_nonce, x_gw_timestamp, `/guardian/api/member/getToken.json?${getToken_data}`);
    return new Promise((resolve) => {
        let url = {
            url: `https://api.wx.gcihotel.net/guardian/api/member/getToken.json?${getToken_data}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "x-gw-signature-headers": "x-gw-key,x-gw-nonce,x-gw-timestamp",
                "charset": "utf-8",
                "x-gw-timestamp": x_gw_timestamp,
                "x-gw-nonce": x_gw_nonce,
                "User-Agent": user_agent,
                "content-type": "application/json",
                "x-gw-key": x_gw_key,
                "x-gw-signature": x_gw_signature,
                "membertoken": `${memberToken}`,
                "accept": "*/*",
                "Referer": "https://servicewechat.com/wx55fa79a0df611abd/36/page-frame.html"
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取token Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.result == 1) {
                        token = html.retVal.token;
                    } else {
                        $.log("获取token " + html.msg);
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

//获取跳转登录url
async function miniAppAutoLogin() {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://myjd.activity-13.m.duiba.com.cn/wechat/mingyu/miniAppAutoLogin?_=${timestamp}&appId=78412&token=${token}&redirect=//myjd.activity-13.m.duiba.com.cn/chw/visual-editor/skins?id=143983`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "accept": "*/*",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/customShare/share?id=5819&miniProgramOpenid=${openid}&appid=wx55fa79a0df611abd&t=${timestamp}&token=${token}&thirdPartyChannel=duiba&redirect=%2F%2Fmyjd.activity-13.m.duiba.com.cn%2Fchw%2Fvisual-editor%2Fskins%3Fid%3D143983`,
                "Cookie": ``
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取跳转登录url Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == "0000000000") {
                        let autologin_url = html.data;
                        await $.wait(2000); //等待2秒
                        await autoLogin_autologin(autologin_url);
                    } else {
                        $.log("获取跳转登录url " + html.desc);
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
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `${autologin_url}`,
            followRedirect: false,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "upgrade-insecure-requests": "1",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "x-requested-with": "com.tencent.mm",
                "sec-fetch-site": "cross-site",
                "sec-fetch-mode": "navigate",
                "sec-fetch-dest": "document",
                "referer": `https://myjd.activity-13.m.duiba.com.cn/customShare/share?id=5819&miniProgramOpenid=${openid}&appid=wx55fa79a0df611abd&t=${timestamp}&token=${token}&thirdPartyChannel=duiba&redirect=%2F%2Fmyjd.activity-13.m.duiba.com.cn%2Fchw%2Fvisual-editor%2Fskins%3Fid%3D143983`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/chw/visual-editor/skins?id=143983&from=login&spm=78412.1.1.1`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/chw/ctoken/getToken`,
            body: `timestamp=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/sign/component/doSign?_=${timestamp}`,
            body: `signOperatingId=${signOperatingId}&token=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/sign/component/signResult?orderNum=${orderNum}&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/sign/component/index?signOperatingId=${signOperatingId}&preview=false&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/chw/ctoken/getToken`,
            body: `timestamp=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/sign/component/doJoin?_=${timestamp}`,
            body: `signOperatingId=${signOperatingId}&token=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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
            url: `https://myjd.activity-13.m.duiba.com.cn/plugin/getOrderStatus?orderId=${orderNum}&_=${timestamp}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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

//1积分转好礼
//打开转盘页面
async function hdtool_index(actId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://myjd.activity-13.m.duiba.com.cn/hdtool/index?id=${actId}&dbnewopen`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/chw/visual-editor/skins?id=143983&from=login&spm=78412.1.1.1`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开转盘页面Api请求失败`);
                } else {
                    let html = data;
                    let htmlx = html.substring(html.indexOf("var againOrderId = null;") + 24);
                    htmlx = htmlx.substring(0, htmlx.indexOf("</script>"));
                    eval(htmlx);
                    let htmlx2 = eval(htmlx.substring(htmlx.indexOf("\\u0065\\u0076\\u0061\\u006c") + 24));
                    let key = htmlx2.substring(htmlx2.indexOf("var key = '") + 11);
                    key = key.substring(0, key.indexOf("';"));
                    await getTokenNew(key, actId);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取getTokenNew
async function getTokenNew(key, actId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://myjd.activity-13.m.duiba.com.cn/hdtool/ctoken/getTokenNew`,
            body: `timestamp=${timestamp}&activityId=${actId}&activityType=hdtool&consumerId=3833113361`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/hdtool/index?id=${actId}&dbnewopen`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取getTokenNew Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var window = {};
                        eval(data2.token);
                        let token = window[key];
                        $.log("获取getTokenNew成功");
                        await hdtool_doJoin(token, actId);
                    } else {
                        $.log(`获取getTokenNew错误`);
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

//开始转盘抽奖
async function hdtool_doJoin(token, actId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://myjd.activity-13.m.duiba.com.cn/hdtool/doJoin?dpm=78412.3.1.0&activityId=${actId}&_=${timestamp}`,
            body: `actId=${actId}&oaId=${actId}&activityType=hdtool&consumerId=3833113361&token=${token}`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/hdtool/index?id=${actId}&dbnewopen`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`转盘抽奖Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        $.log(`转盘抽奖成功`);
                        let orderId = data2.orderId;
                        await $.wait(5000); //等待5秒
                        await hdtool_getOrderStatus(orderId, actId);
                    } else {
                        $.log(`转盘抽奖` + data2.message);
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

//转盘抽奖结果
async function hdtool_getOrderStatus(orderId, actId) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://myjd.activity-13.m.duiba.com.cn/hdtool/getOrderStatus?_=${timestamp}`,
            body: `orderId=${orderId}&adslotId=`,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/hdtool/index?id=${actId}&dbnewopen`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`转盘抽奖结果Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        $.log(`转盘抽奖结果成功`);
                        let title = data2.lottery.title;
                        $.log(`转盘抽奖结果` + title);
                    } else {
                        $.log(`转盘抽奖结果` + data2.message);
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
            url: `https://myjd.activity-13.m.duiba.com.cn/ctool/getCredits?_=${timestamp}`,
            body: ``,
            headers: {
                'x-forwarded-for': `${x_forwarded_for}`,
                "user-agent": `${user_agent}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https://myjd.activity-13.m.duiba.com.cn/sign/component/page?signOperatingId=${signOperatingId}`,
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