const fs = require('fs');
const path = require('path');

//修改环境变量的方法，参数1：环境变量名；参数2：环境变量的新值
function setEnvVar(envName, newValue) {
  const configPath = path.join(__dirname, '../config/config.sh');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const pattern = new RegExp(`^export ${envName}='(.*)';`, 'm');
  const match = configContent.match(pattern);
  if (match) {
    const oldValue = match[1];	//另一种读取环境变量的方式
    const newContent = configContent.replace(pattern, `export ${envName}='${newValue}';`);
    fs.writeFileSync(configPath, newContent);
    console.log(`${envName}的值已从${oldValue}修改为${newValue}`);
  } else {
    console.error(`找不到${envName}变量`);
  }
}

setEnvVar('MY_TOKEN', 'new_token_value');