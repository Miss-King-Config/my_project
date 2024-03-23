/*
滴滴果园 种植换实物

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#滴滴果园
00 01 8,12,18 * * * , tag=滴滴果园, img-url=, enabled=true

================Loon==============
[Script]
cron "00 01 8,12,18 * * *" script-path=,tag=滴滴果园

===============Surge=================
滴滴果园 = type=cron,cronexp="00 01 8,12,18 * * *",wake-system=1,timeout=33600,script-path=

============小火箭=========
滴滴果园 = type=cron,script-path=, cronexpr="00 01 8,12,18 * * *", timeout=33600, enable=true
*/

const $ = new Env('滴滴果园');
$.log(`需要新建环境变量: Ddgy_ticket\n填写抓包https://epassport.diditaxi.com.cn/passport/login/v5/signInByOpenid的ticket\n多用户可以用"#" "@" "\\n" 隔开`);

var appUrlArr = [];
var ticket = '';
var token = '';
var uid = '';
var wsgsig = 'dd03-T+DAm5GDzJmCq87S/wKrO1+fTQfEVQzRi1NlyP7aTQfFqoKtqwXqQ1gAw3mFq8CPkYJSPH81xKvGmJNlUZgsRM0CwJpcrpnvU54tQHscPpQ0ru3h/5+ZzMKFwuA';
var kongzhi = false;

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
    const Ddgy_ticket = ($.isNode() ? (process.env.Ddgy_ticket) : ($.getval('Ddgy_ticket'))) || "";
    if (!Ddgy_ticket) {
        let str = Ddgy_ticket ? "" : "Ddgy_ticket";
        $.log(`未找到环境变量: ${str}\n`);
        return false;
    }
    if (Ddgy_ticket.indexOf('#') != -1) {
        appUrlArrs = Ddgy_ticket.split('#');
        $.log(`您选择的是用"#"隔开 Ddgy_ticket\n`);
    } else if (Ddgy_ticket.indexOf('\n') != -1) {
        appUrlArrs = Ddgy_ticket.split('\n');
        $.log(`您选择的是用"\\n"隔开 Ddgy_ticket\n`);
    } else if (Ddgy_ticket.indexOf('@') != -1) {
        appUrlArrs = Ddgy_ticket.split('@');
        $.log(`您选择的是用"@"隔开 Ddgy_ticket\n`);
    } else {
        appUrlArrs = [Ddgy_ticket];
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
    ticket = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`\n用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        await signInByOpenid();
        if (kongzhi) {
            await $.wait(2000); //等待2秒
            await goal();
            await $.wait(2000); //等待2秒
            await heartbeatDog();
            await $.wait(2000); //等待2秒
            await plant_receivePer();
            await $.wait(2000); //等待2秒
            await recBucketWater();
            await $.wait(2000); //等待2秒
            await sign();
            await $.wait(2000); //等待2秒
            await mission_get();
            await $.wait(2000); //等待2秒
            await plant_newFertilizer();
            await $.wait(2000); //等待2秒
            await plant_newWatering();
            await $.wait(2000); //等待2秒
            await plant_recCommonBox();
        }
        kongzhi = false;
        await $.wait(5000); //等待5秒
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

//获取token
async function signInByOpenid() {
    return new Promise((resolve) => {
        var signInByOpenid_data = {
            'lang': 'zh-CN',
            'access_key_id': '9',
            'appversion': '6.7.46',
            'channel': '1100000002',
            '_ds': '',
            'xpsid': '964ba2a8655f4c13b8b6c119a58c51db',
            'xpsid_root': '964ba2a8655f4c13b8b6c119a58c51d',
            'q': JSON.stringify({
                "api_version": "1.0.1",
                "appid": 35009,
                "role": 1,
                "extra_info": {
                    "channel": 1100000002
                },
                "device_name": "ELE-AL00",
                "sec_session_id": "",
                "ddfp": "2cd57817220b390aa78bd27ec06f0ff334f1",
                "lang": "zh-CN",
                "wsgenv": "",
                "model": "HUAWEI ELE-AL00",
                "unionid_through_login": true,
                "oauthcode": "",
                "ticket": `${ticket}`,
                "with_temp_ticket": true
            })
        };
        let url = {
            url: `https://epassport.diditaxi.com.cn/passport/login/v5/signInByOpenid?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'utf-8'
            },
            body: object2str(signInByOpenid_data),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`获取tokenApi请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`获取token成功`);
                        token = data2.temp_ticket;
                        uid = data2.uid;
                        kongzhi = true;
                    } else {
                        $.log(`获取token` + data2.error);
                        kongzhi = false;
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

//吹牛赚水滴刷水滴
async function goal() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/cow/goal?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "EpjLe00",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "uid": "299069700824137",
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`吹牛赚水滴刷水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`吹牛赚水滴刷水滴成功` + data2.data.water_wallet.cur);
                        await $.wait(2000); //等待2秒
                        await goal();
                    } else {
                        $.log(`吹牛赚水滴刷水滴` + data2.errmsg);
                        await award();
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

//吹牛赚水滴领水滴
async function award() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/cow/award?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "EpjLe00",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`吹牛赚水滴领水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`吹牛赚水滴领水滴成功`);
                    } else {
                        $.log(`吹牛赚水滴领水滴` + data2.errmsg);
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

//狗狗在线2分钟领化肥刷新
async function heartbeatDog() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/heartbeatDog?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "EpjLe00",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`狗狗在线2分钟领化肥刷新Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`狗狗在线2分钟领化肥刷新成功` + data2.data.fertilizer);
                    } else {
                        $.log(`狗狗在线2分钟领化肥刷新` + data2.errmsg);
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

//狗狗在线2分钟领化肥领取
async function plant_receivePer() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/receivePer?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`狗狗在线2分钟领化肥领取Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`狗狗在线2分钟领化肥领取成功`);
                    } else {
                        $.log(`狗狗在线2分钟领化肥领取` + data2.errmsg);
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

//领取水桶水滴
async function recBucketWater() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/recBucketWater?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "EpjLe00",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`领取水桶水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`领取水桶水滴成功` + data2.data.rec_water);
                    } else {
                        $.log(`领取水桶水滴` + data2.errmsg);
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
async function sign() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/sign?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "EpjLe00",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`签到Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`签到成功` + data2.data.rewards[0].name + data2.data.rewards[0].num);
                    } else {
                        $.log(`签到失败` + data2.errmsg);
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

//打开任务栏
async function mission_get() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/mission/get?xbiz=240301&prod_key=didi-orchard&xpsid=6ef42047aa9d4d56a6459d396bb472fc&dchn=k57MWrY&xoid=34b85dbb-2565-4aff-a925-c5d03a9ddbb2&xenv=wxmp&xspm_from=ut-aggre-homepage.none.c460.none&xpsid_root=661e74ddfe9546208cb21b72f04f6e2a&xpsid_from=661e74ddfe9546208cb21b72f04f6e2a&xpsid_share=&game_id=23&loop=0&platform=1&token=${token}&wsgsig=${wsgsig}`,
            headers: {
                'D-Header-T': `${token}`
            }
        };
        $.get(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`打开任务栏Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        var missions = data2.data.missions;
                        for (let i = 0; i < missions.length; i++) {
                            var id = missions[i].id;
                            var title = missions[i].title;
                            await $.wait(2000); //等待2秒
                            await mission_update(title, id);
                            await $.wait(2000); //等待2秒
                            await mission_award(title, id);
                            await $.wait(2000); //等待2秒
                        }
                    } else {
                        $.log(`打开任务栏` + data2.errmsg);
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

//完成任务栏任务
async function mission_update(title, mission_id) {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/mission/update?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "mission_id": parseInt(`${mission_id}`),
                "game_id": 23,
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`完成任务栏任务Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`完成任务栏任务 ${title}成功`);
                    } else {
                        $.log(`完成任务栏任务 ${title}` + data2.errmsg);
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

//完成任务栏任务领取
async function mission_award(title, mission_id) {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/mission/award?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "mission_id": parseInt(`${mission_id}`),
                "game_id": 23,
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`完成任务栏任务领取Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        var reward = data2.data.reward;
                        var name = reward[0].name;
                        var count = reward[0].count;
                        $.log(`完成任务栏任务领取 ${title} 获得${name}${count}`);
                    } else {
                        $.log(`完成任务栏任务领取 ${title}` + data2.errmsg);
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

//施肥
async function plant_newFertilizer() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/newFertilizer?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "count": 1,
                "quick": true,
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`施肥Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        var tree_nutrient = data2.data.tree_nutrient;
                        $.log(`施肥 成功 现有肥力${tree_nutrient}`);
                    } else {
                        $.log(`施肥` + data2.errmsg);
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

//浇水
async function plant_newWatering() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/newWatering?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "is_fast": false,
                "water_status": 0,
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`浇水Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        var tree_progress = data2.data.tree_progress;
                        $.log(`浇水 成功 进度${tree_progress}%`);
                        await $.wait(2000); //等待2秒
                        await plant_newWatering();
                    } else {
                        $.log(`浇水` + data2.errmsg);
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

//开启宝箱
async function plant_recCommonBox() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/recCommonBox?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": "6ef42047aa9d4d56a6459d396bb472fc",
                "dchn": "k57MWrY",
                "xoid": "34b85dbb-2565-4aff-a925-c5d03a9ddbb2",
                "xenv": "wxmp",
                "xspm_from": "ut-aggre-homepage.none.c460.none",
                "xpsid_root": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_from": "661e74ddfe9546208cb21b72f04f6e2a",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`开启宝箱Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        var rewards = data2.data.rewards;
                        var name = rewards[0].name;
                        var num = rewards[0].num;
                        $.log(`开启宝箱 成功 获得${name}${num}`);
                        await $.wait(2000); //等待2秒
                        await plant_recCommonBox();
                    } else {
                        $.log(`开启宝箱` + data2.errmsg);
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