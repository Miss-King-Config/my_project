/*
微信公众号 汤臣倍健营养家 签到
cron "0 0 5,6 * * *" 
const $ = new Env('汤臣倍健营养家');
*/

const axios = require('axios');
const qs = require('qs');
const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

console.log('需要新建环境变量: Tcbjyyj_openid\n填写抓包openid\n多用户可以用# @ \\n 隔开');
var appUrlArr = [];
var openid = "";
var Tcbjyyj_openid = "";

!(async () => {
    //检查环境变量
    console.log(`开始检测环境变量`);
    if (!(await checkEnv())) {
        return;
    } else {
        //获取用户信息
        await initAccountInfo();
    }
})().catch((e) => console.error(e));

async function checkEnv() {
    const Tcbjyyj_openid = process.env.Tcbjyyj_openid || "";
    if (!Tcbjyyj_openid) {
        let str = Tcbjyyj_openid ? "" : "Tcbjyyj_openid";
        console.log('未找到环境变量: ' + str + '\n');
        return false;
    }
    if (Tcbjyyj_openid.indexOf('#') != -1) {
        appUrlArrs = Tcbjyyj_openid.split('#');
        console.log('您选择的是用"#"隔开: Tcbjyyj_openid\n');
    } else if (Tcbjyyj_openid.indexOf('\n') != -1) {
        appUrlArrs = Tcbjyyj_openid.split('\n');
        console.log('您选择的是用"\\n"隔开: Tcbjyyj_openid\n');
    } else if (Tcbjyyj_openid.indexOf('@') != -1) {
        appUrlArrs = Tcbjyyj_openid.split('@');
        console.log('您选择的是用"@"隔开: Tcbjyyj_openid\n');
    } else {
        appUrlArrs = [Tcbjyyj_openid];
    }
    Object.keys(appUrlArrs).forEach((item) => {
        if (appUrlArrs[item]) {
            appUrlArr.push(appUrlArrs[item]);
        }
    });
    totalUser = appUrlArr.length;
    console.log('共找到' + totalUser + '个用户\n');
    return true;
}

async function getEnvParam(userNum) {
    let appUrlArrVal = appUrlArr[userNum];
    openid = appUrlArrVal;
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        console.log('\n用户' + (numUser + 1) + '开始执行\n');
        await getEnvParam(numUser);
        await sign_saveSign();
        await delay(2000); //等待2秒
    }
}

//签到
async function sign_saveSign() {
    axios.post('https://hdyx.by-health.com/taskCenter/api/sign/saveSign', qs.stringify({
        openid: openid
    })).then(function(response) {
        //console.log(response);
        let data = response.data;
        if (data.signBaseInfo) {
            let lastSignPoint = data.signBaseInfo.lastSignPoint;
            let continuousSignDays = data.signBaseInfo.continuousSignDays;
            console.log("签到: 签到成功 本周期签到" + lastSignPoint + "天 连续签到" + continuousSignDays + "天");
        } else {
            console.log("签到: " + data.message);
        }
    }).catch(function(error) {
        //console.log(error);
        console.log("签到: " + error.response.data.message);
    });
}
