/*
甬派

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#甬派
00 00 8,11 * * * , tag=甬派, img-url=, enabled=true

================Loon==============
[Script]
cron "00 00 8,11 * * *" script-path=,tag=甬派

===============Surge=================
甬派 = type=cron,cronexp="00 00 8,11 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
甬派 = type=cron,script-path=, cronexpr="00 00 8,11 * * *", timeout=33600, enable=true
*/

const $ = new Env('甬派');
$.log(`需要新建环境变量: Yp_list\n填写 账号----密码----支付宝账户----支付宝姓名\n多用户可以用"####" "@@@@" "\\n" 隔开`);

var appUrlArr = [];
var username = "";
var password = "";
var deviceId = "";
var wtoken = "";
var ticket = "";
var userId = "";
var token = "";
var alipay = "";
var realname = "";
var jwtToken = "";
var nickname = "";
var Cookie = "";
var activity_url = "";

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
    const Yp_list = ($.isNode() ? (process.env.Yp_list) : ($.getval('Yp_list'))) || "";
    if (!Yp_list) {
        let str = Yp_list ? "" : "Yp_list";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Yp_list.indexOf('####') != -1) {
        appUrlArrs = Yp_list.split('####');
        $.log(`您选择的是用"####"隔开 Yp_list\n`);
    } else if (Yp_list.indexOf('\n') != -1) {
        appUrlArrs = Yp_list.split('\n');
        $.log(`您选择的是用"\\n"隔开 Yp_list\n`);
    } else if (Yp_list.indexOf('@@@@') != -1) {
        appUrlArrs = Yp_list.split('@@@@');
        $.log(`您选择的是用"@@@@"隔开 Yp_list\n`);
    } else {
        appUrlArrs = [Yp_list];
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
        let str_list = appUrlArrVal.split("----");
        for (let i = 0; i < str_list.length; i++) {
            username = str_list[0];
            password = str_list[1];
            alipay = str_list[2];
            realname = str_list[3];
        }
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        await login2_local3();
        await $.wait(2000); //等待2秒
        await news_list(0);
        await $.wait(2000); //等待2秒
        await news_list(2);
        await $.wait(2000); //等待2秒
        await news_list4(4);
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

async function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function randomStr(i) {
    let t = "",
        e = "abcdef0123456789";
    for (let n = 0; n < i; n++) t += e.charAt(Math.floor(Math.random() * e.length));
    return t;
}

//登录
async function login2_local3() {
    deviceId = await randomStr(16);
    let globalDatetime = Date.now();
    let sign = toMd5Hex(`globalDatetime${globalDatetime}username${username}test_123456679890123456`).toUpperCase();
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-user/api/login2/local3?username=${username}&password=${encodeURIComponent(password)}&deviceId=${deviceId}&globalDatetime=${globalDatetime}&sign=${sign}`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`,
                "Cookie": ""
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`登录 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let score = html.data.score;
                        jwtToken = html.data.jwtToken;
                        nickname = html.data.nickname;
                        userId = html.data.userId;
                        token = html.data.token;
                        $.log(`登录 获得${score}积分`);
                        await $.wait(2000); //等待2秒
                        await member_login();
                    } else {
                        $.log(`登录 ${html.message}`);
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

async function member_login() {
    let sign = toMd5Hex(`/member/login{loginName:${username},name:${nickname},phone:${username},userId:${userId}}`);
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/web-nbcc/member/login?userId=${userId}&loginName=${username}&name=${nickname}&phone=${username}`,
            headers: {
                "module": "web-member",
                "sign": `${sign}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`member_login Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        ticket = html.data;
                    } else {
                        $.log(`member_login ${html.message}`);
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

//要稳列表
async function news_list(channelId) {
    let currentPage = await random(0, 20);
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-news/api/news/list?channelId=${channelId}&currentPage=${currentPage}&timestamp=0`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`要稳列表 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let content = html.data.content;
                        for (let i = 0; i < content.length; i++) {
                            let newsId = content[i].newsId;
                            if (newsId != null) {
                                await $.wait(1000); //等待1秒
                                await news_detail(newsId);
                                await $.wait(1000); //等待1秒
                                await forward_news(newsId);
                                await $.wait(1000); //等待1秒
                                await praise_save_news(newsId);
                            }
                        }
                    } else {
                        $.log(`要稳列表 ${html.message}`);
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

//阅读新闻
async function news_detail(newsId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-news/api/news/detail?newsId=${newsId}&userId=${userId}&deviceId=${deviceId}`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`阅读新闻 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let score = html.data.score;
                        $.log(`阅读新闻 获得${score}积分`);
                    } else {
                        $.log(`阅读新闻 ${html.message}`);
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

//分享新闻
async function forward_news(newsId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-ugc/api/forward/news?newsId=${newsId}&userId=${userId}&source=1`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`分享新闻 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let score = html.data;
                        $.log(`分享新闻 获得${score}积分`);
                    } else {
                        $.log(`分享新闻 ${html.message}`);
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

//点赞新闻
async function praise_save_news(newsId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-ugc/api/praise/save_news?newsId=${newsId}&userId=${userId}&deviceId=${deviceId}`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`点赞新闻 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let score = html.data.score;
                        $.log(`点赞新闻 获得${score}积分`);
                    } else {
                        $.log(`点赞新闻 ${html.message}`);
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

//福利列表
async function news_list4(channelId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-news/api/news/list?channelId=${channelId}&currentPage=1&timestamp=0`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`福利列表 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let content = html.data.content;
                        for (let i = 0; i < content.length; i++) {
                            let keywords = content[i].keywords;
                            let newsId = content[i].newsId;
                            if (newsId != null && keywords.indexOf("大转盘") != -1) {
                                await $.wait(1000); //等待1秒
                                await news_detail4(newsId);
                                break;
                            }
                        }
                    } else {
                        $.log(`福利列表 ${html.message}`);
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

//打开福利大转盘
async function news_detail4(newsId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-news/api/news/detail?newsId=${newsId}&userId=${userId}&deviceId=${deviceId}`,
            headers: {
                "system": "Android",
                "version": "28",
                "model": "ELE-AL00",
                "appversion": "10.1.7",
                "appbuild": "202401140",
                "deviceid": `${deviceId}`,
                "wtoken": `${wtoken}`,
                "ticket": `${ticket}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`阅读新闻 Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let body = html.data.body;
                        let href = body.substr(body.indexOf("href=\"") + 6);
                        let dbredirect = href.substr(0, href.indexOf("\""));
                        dbredirect = dbredirect.replace(/amp;/g, "");
                        await $.wait(2000); //等待2秒
                        await duiba_autologin(dbredirect);
                    } else {
                        $.log(`阅读新闻 ${html.message}`);
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

async function duiba_autologin(dbredirect) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ypapp.cnnb.com.cn/yongpai-user/api/duiba/autologin?userId=${userId}&dbredirect=${encodeURIComponent(dbredirect)}`
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`duiba_autologin Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let lottery_url = html.data;
                        await $.wait(2000); //等待2秒
                        await autoLogin_autologin(lottery_url);
                    } else {
                        $.log(`duiba_autologin ${html.message}`);
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

async function autoLogin_autologin(lottery_url) {
    return new Promise((resolve) => {
        let url = {
            url: `${lottery_url}`,
            followRedirect: false,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                "Cookie": "userinfo=" + JSON.stringify({
                    "appVersion": "10.1.7",
                    "deviceId": `${deviceId}`,
                    "jwtToken": `${jwtToken}`,
                    "nickname": `${nickname}`,
                    "ticket": `${ticket}`,
                    "token": `${token}`,
                    "userAgent": "yongpai",
                    "userId": `${userId}`
                })
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`autoLogin_autologin Api请求失败`);
                } else {
                    let location_url = resp.headers.location;
                    let s3 = "";
                    for (let i in resp.headers['set-cookie']) {
                        let s2 = resp.headers['set-cookie'][i];
                        s3 += s2.substring(0, s2.indexOf(";") + 2);
                    }
                    Cookie = s3;
                    activity_url = location_url.split("/")[2];
                    await $.wait(2000); //等待2秒
                    await hdtool_index(location_url);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

async function hdtool_index(location_url) {
    return new Promise((resolve) => {
        let url = {
            url: `${location_url}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`autoLogin_autologin Api请求失败`);
                } else {
                    let html = data;
                    let htmlx = html.substring(html.indexOf("var CFG ="));
                    htmlx = htmlx.substring(0, htmlx.indexOf("</script>"));
                    eval(htmlx);
                    let htmlx2 = eval(htmlx.substring(htmlx.indexOf("\\u0065\\u0076\\u0061\\u006c") + 24));
                    let key = htmlx2.substring(htmlx2.indexOf("var key = '") + 11);
                    key = key.substring(0, key.indexOf("';"));
                    let CFG2 = html.substring(html.indexOf("var CFG = "));
                    CFG2 = CFG2.substring(0, CFG2.indexOf(';') + 1);
                    eval(CFG2);
                    let actId = CFG.actId;
                    let consumerId = CFG.consumerId;
                    let doJoin = CFG.doJoin;
                    await $.wait(2000); //等待2秒
                    await getTokenNew(doJoin, actId, consumerId, key, location_url);
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
async function getTokenNew(doJoin, actId, consumerId, key, location_url) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://${activity_url}/hdtool/ctoken/getTokenNew`,
            body: `timestamp=${timestamp}&activityId=${actId}&activityType=hdtool&consumerId=${consumerId}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `${location_url}`,
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
                        $.log("获取getTokenNew 成功");
                        await hdtool_doJoin(doJoin, actId, consumerId, token, location_url);
                    } else {
                        $.log(`获取getTokenNew 错误`);
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
async function hdtool_doJoin(doJoin, actId, consumerId, token, location_url) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://${activity_url}${doJoin}&_=${timestamp}`,
            body: `actId=${actId}&oaId=${actId}&activityType=hdtool&consumerId=${consumerId}&token=${token}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `${location_url}`,
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
                        let orderId = data2.orderId;
                        await $.wait(10000); //等待10秒
                        await hdtool_getOrderStatus(orderId, location_url);
                    } else {
                        $.log(`开始抽奖` + data2.message);
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
async function hdtool_getOrderStatus(orderId, location_url) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://${activity_url}/hdtool/getOrderStatus?orderId=${orderId}&_=${timestamp}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                "Referer": `${location_url}`,
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
                        let title = data2.lottery.title;
                        let link = data2.lottery.link;
                        $.log(`抽奖结果 ` + title);
                        await $.wait(2000); //等待2秒
                        await activity_takePrizeNew(link, location_url);
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

//打开兑换页面
async function activity_takePrizeNew(link, location_url) {
    return new Promise((resolve) => {
        let url = {
            url: `https:${link}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                "Referer": `${location_url}`,
                "Cookie": `${Cookie}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`activity_takePrizeNew Api请求失败`);
                } else {
                    let html = data;
                    let htmlx = html.substring(html.indexOf("var CFG ="));
                    htmlx = htmlx.substring(0, htmlx.indexOf("</script>"));
                    eval(htmlx);
                    let htmlx2 = eval(htmlx.substring(htmlx.indexOf("\\u0065\\u0076\\u0061\\u006c") + 24));
                    let key = htmlx2.substring(htmlx2.indexOf("var key = '") + 11);
                    key = key.substring(0, key.indexOf("';"));
                    let CFG2 = html.substring(html.indexOf("var CFG = "));
                    CFG2 = CFG2.substring(0, CFG2.indexOf(';') + 1);
                    eval(CFG2);
                    let doTakePrize = CFG.doTakePrize;
                    let recordId = CFG.recordId;
                    await $.wait(2000); //等待2秒
                    await ctoken_getToken_do(doTakePrize, recordId, key, link);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//获取ctoken_getToken_do
async function ctoken_getToken_do(doTakePrize, recordId, key, link) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://${activity_url}/ctoken/getToken.do`,
            body: ``,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https:${link}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取ctoken_getToken_do Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        var window = {};
                        eval(data2.token);
                        let token = window[key];
                        $.log("获取ctoken_getToken_do 成功");
                        await activity_doTakePrize(doTakePrize, recordId, token, link);
                    } else {
                        $.log(`获取ctoken_getToken_do ${data2.message}`);
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
async function activity_doTakePrize(doTakePrize, recordId, token, link) {
    let timestamp = Date.now();
    return new Promise((resolve) => {
        let url = {
            url: `https://${activity_url}${doTakePrize}`,
            body: `alipay=${alipay}&realname=${encodeURIComponent(realname)}&recordId=${recordId}&token=${token}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Linux; Android 9; ELE-AL00 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 agentweb/4.0.2  UCBrowser/11.6.4.950 yongpai",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer": `https:${link}`,
                "Cookie": `${Cookie}`
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`兑换activity_doTakePrize Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.success) {
                        $.log(`兑换activity_doTakePrize ${data2.message}`);
                    } else {
                        $.log(`兑换activity_doTakePrize ${data2.message}`);
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