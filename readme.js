// 2017年11月20日11点20分
var callme = {
    execute: execute
}

function execute(smsNumber, msgContent, smsReciveTime) {
    var emailData = getEmail(smsNumber, msgContent, smsReciveTime);
    var webUrlData = getWebUrl(smsNumber, msgContent, smsReciveTime);
    var expressNumberData = getExpressNumber(smsNumber, msgContent, smsReciveTime);
    var dateTimeData = getDateTime(smsNumber, msgContent, smsReciveTime);
    var phoneNumberData = getPhoneNumber(smsNumber, msgContent, smsReciveTime);
    //var filmNameData = getFilmName(smsNumber, msgContent, smsReciveTime);
    //var addressData = getAddress(smsNumber, msgContent, smsReciveTime);

    var tempData = emailData
        .concat(webUrlData)
        .concat(expressNumberData)
        .concat(dateTimeData)
        .concat(phoneNumberData);
    //.concat(filmNameData)
    //.concat(addressData);

    var resultData = [];
    for (var i = 0; i < tempData.length; i++) {
        var isIntersect = false;
        for (var j = 0; j < resultData.length; j++) {
            if (tempData[i].startIndex == resultData[j].startIndex && tempData[i].endIndex == resultData[j].endIndex) {
                isIntersect = true;
                break;
            } else if (tempData[i].startIndex <= resultData[j].startIndex && tempData[i].endIndex >= resultData[j].endIndex) {
                resultData.splice(j, 1);
                break;
            } else if (tempData[i].startIndex < resultData[j].endIndex && tempData[i].endIndex > resultData[j].startIndex) {
                isIntersect = true;
                break;
            }
        }

        if (!isIntersect) {
            resultData.push(tempData[i]);
        }
    }

    return JSON.stringify(resultData);
}

//========================邮箱识别 start==========================
function getEmail(smsNumber, msgContent, smsReciveTime) {
    var emailRegex = new RegExp("[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+\\.){1,63}[A-Za-z0-9]{2,5}", "g");
    var results = [];

    msgContent.replace(emailRegex, function () {
        var arr = arguments;
        result = {
            linkText: "mailto:" + arr[0],
            startIndex: arr[arr.length - 2],
            endIndex: arr[arr.length - 2] + arr[0].length,
            action: actionArr[14].value,
        };
        results.push(result);
    });
    return results;
}
//========================邮箱识别 end============================

//========================网址识别 start==========================
function getWebUrl(smsNumber, msgContent, smsReciveTime) {
    var webUrlRegex = new RegExp("((http|ftp|https)://)?(([a-zA-Z0-9][a-zA-Z0-9\\._-]*\\.([a-zA-Z]{2,6}))|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}))(:[0-9]{1,4})?([a-zA-Z0-9\\&%_\\./:;=?-~-]*)?", "g");
    var httpHeaderRegex = new RegExp("^((http|ftp|https)://)");
    var results = []

    msgContent.replace(webUrlRegex, function () {
        var arr = arguments;
        var link = arr[0];
        var start = arr[arr.length - 2];
        var end = start + link.length;
        if (arr[5].length > 3) {
            return;
        }
        if (start == 0 || msgContent[start - 1] != "@") {
            result = {
                linkText: httpHeaderRegex.test(link) ? link : "http://" + link,
                startIndex: start,
                endIndex: end,
                action: actionArr[1].value,
            };
            results.push(result);
        }
    });
    return results;
}
//========================网址识别 end============================

//========================快递识别 start==========================
function getExpressNumber(smsNumber, msgContent, smsReciveTime) {
    var expressRegex = new RegExp("(快递|快件|运单|运单号|快递单号|包裹|[^保订]单号|包裹|宝贝)([^a-zA-Z0-9员]{0,3})([a-zA-Z0-9]{9,1000})", "g");
    var results = [];
    msgContent.replace(expressRegex, function () {
        var arr = arguments;
        if (arr[3].length > 18  ||  arr[3].length < 8 || arr[3].length == 11) { // 2019-04-12 添加快递黑名单
            return;
        } 
        result = {
            linkText: "exp:" + arr[3],
            startIndex: arr[4] + arr[1].length + arr[2].length,
            endIndex: arr[4] + arr[1].length + arr[2].length + arr[3].length,
            action: '',
        };
        results.push(result);
    });
    return results;
}
//========================快递识别 end============================

//========================日期识别 start==========================
var char2IntMap = {
    "六十": "60",
    "五十九": "59",
    "五十八": "58",
    "五十七": "57",
    "五十六": "56",
    "五十五": "55",
    "五十四": "54",
    "五十三": "53",
    "五十二": "52",
    "五十一": "51",
    "五十": "50",
    "四十九": "49",
    "四十八": "48",
    "四十七": "47",
    "四十六": "46",
    "四十五": "45",
    "四十四": "44",
    "四十三": "43",
    "四十二": "42",
    "四十一": "41",
    "四十": "40",
    "三十九": "39",
    "三十八": "38",
    "三十七": "37",
    "三十六": "36",
    "三十五": "35",
    "三十四": "34",
    "三十三": "33",
    "三十二": "32",
    "三十一": "31",
    "三十": "30",
    "二十九": "29",
    "二十八": "28",
    "二十七": "27",
    "二十六": "26",
    "二十五": "25",
    "二十四": "24",
    "二十三": "23",
    "二十二": "22",
    "二十一": "21",
    "二十": "20",
    "十九": "19",
    "十八": "18",
    "十七": "17",
    "十六": "16",
    "十五": "15",
    "十四": "14",
    "十三": "13",
    "十二": "12",
    "十一": "11",
    "十": "10",
    "九": "9",
    "八": "8",
    "七": "7",
    "六": "6",
    "五": "5",
    "四": "4",
    "三": "3",
    "二": "2",
    "一": "1",
    "零": "0"
};

function getDateTime(smsNumber, msgContent, smsReciveTime) {
    var dateRegex = new RegExp("(?:周[一二三四五六])?(([0-9零一二三四五六七八九]{2,4})[\\-./年]?)?(([0-9零一二三四五六七八九十]{1,2})[\\-./月]?)?(([0-9]{1,3}|[零一二三四五六七八九十]{1,3})日?)( {0,3}?(([0-9]{1,2}|[零一二三四五六七八九十]{1,3})[:：点时])(([0-9]{1,2}|[零一二三四五六七八九十]{1,3})[:：分]?)?(([0-9]{1,2}|[零一二三四五六七八九十]{1,3})[秒]?)?)?", "g");
    var sequenceEndRegex = new RegExp('[0-9零一二三四五六七八九a-zA-Z%]')
    //因为会出现周四12月29号这种格式所以要排除周几
    var results = [];

    msgContent.replace(dateRegex, function () {
        var dateTime = new Date(smsReciveTime);
        var arr = arguments;
        var start = arr[arr.length - 2],
            end = arr[arr.length - 2] + arr[0].length;
        frontChart = msgContent.substring(start - 1, start);
        backChart = msgContent.substring(end, end + 1);
        if (sequenceEndRegex.test(frontChart) || //校验日期开头和结尾
            sequenceEndRegex.test(backChart)) {
            return;
        }
        if (arr[3] && arr[5] && arr[3].length == 1) {
            arr[5] = arr[3] + arr[5];
            arr[6] = arr[3] + arr[6];
            arr[3] = null;
            arr[4] = null;
        }

        var year = char2IntYear(arr[2]);
        var month = char2Int(arr[4]);
        var date = char2Int(arr[6]);
        var hour = char2Int(arr[9]);
        var minute = char2Int(arr[11]);
        var content = arr[0];
        var length = content.length;
        if ((length - content.replace(new RegExp("-", "g"), "").length) == 1) { //判断匹配当中是否有一个-
            // 2019-04-12 添加一个黑名单过滤“编号”
            if (new RegExp("在|积").test(msgContent.substring(start - 1, start)) || new RegExp("编号").test(msgContent.substring(start - 2, start))) { //判断前面是否为特殊关键字
                return;
            };
        }
        if (msgContent[arr[arr.length - 2] + arr[0].length] == "月") {
            return;
        }
        if (arr[0].length < 4 || isContainsOtherWords(msgContent, arr[0])) {
            return;
        }
        if (new RegExp("^[0-9]{1,100}$").test(arr[0]) && arr[0].length < 8) {
            return;
        }
        if (year && !month && date) {
            month = year;
            year = undefined;
        }
        if (!year && !month && date && !hour) {
            return;
        }
        if (year) {
            if (year.length == 3 || year == 0) {
                return;
            }
            if (year < 100) {
                if (year <= (dateTime.getFullYear() % 100) + 10) {
                    year = parseInt(year, 0) + 2000;
                } else {
                    year = parseInt(year, 0) + 1900;
                }
            } else if (year > 3000) {
                return;
            }
            if (isNaN(dateTime.setFullYear(year))) {
                return;
            }
        }
        if (month) {
            if (month == 0 || month > 12) {
                return;
            }
            if (isNaN(dateTime.setMonth(parseInt(month, 10) - 1, 1))) {
                return;
            }
        }
        if (date) {
            if (date == 0 || date > 31) {
                return;
            }
            if (isNaN(dateTime.setDate(date))) {
                return;
            }
        }
        if (hour) {
            if (isNaN(dateTime.setHours(hour))) {
                return;
            }
        }
        if (minute) {
            if (isNaN(dateTime.setMinutes(minute))) {
                return;
            }
        } else {
            if (isNaN(dateTime.setMinutes(0))) {
                return;
            }
        }

        result = {
            linkText: "date:" + (hour ? dateTime.Format("yyyy-MM-dd hh:mm") : dateTime.Format("yyyy-MM-dd")),
            startIndex: start,
            endIndex: end,
            action: actionArr[13].value,
        };
        results.push(result);
    });
    return results;
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function char2IntYear(charNumber) {
    var year = 0;
    if (charNumber) {
        for (var i = 0; i < charNumber.length; i++) {
            var char1 = charNumber[i];
            if (char2IntMap[char1]) {
                year = year * 10 + parseInt(char2IntMap[char1], 0);
            } else {
                return charNumber;
            }
        }
    } else {
        return null;
    }
    return year;
}

function char2Int(charNumber) {
    if (charNumber) {
        if (char2IntMap[charNumber]) {
            return char2IntMap[charNumber];
        } else {
            return charNumber;
        }
    }
    return null;
}

function isContainsOtherWords(body, linkText) {
    return body.indexOf(linkText + "元") >= 0 ||
        body.indexOf(linkText + "角") >= 0 ||
        body.indexOf(linkText + "分") >= 0 ||
        body.indexOf(linkText + "分钟") >= 0 ||
        body.indexOf(linkText + "公斤") >= 0 ||
        body.indexOf(linkText + "千克") >= 0 ||
        body.indexOf(linkText + "MB") >= 0 ||
        body.indexOf(linkText + "M") >= 0 ||
        body.indexOf(linkText + "GB") >= 0 ||
        body.indexOf(linkText + "kg") >= 0 ||
        body.indexOf(linkText + "G") >= 0 ||
        body.indexOf(linkText + "KB") >= 0 ||
        body.indexOf(linkText + "K") >= 0 ||
        body.indexOf("尾号" + linkText) >= 0 ||
        body.indexOf("剩余" + linkText) >= 0 ||
        body.indexOf("剩余流量" + linkText) >= 0;
}
//========================日期识别 end============================

//========================电影识别 start==========================
function getFilmName(smsNumber, msgContent, smsReciveTime) {
    var keyWorldList = ["电影", "影院", "影城", "影厅", "影视", "影讯", "影票", "影评", "剧集", "看大片", "连续剧", "电视剧", "卫视直播", "卫视", "热映", "上映", "热播", "看视频", "喜剧", "剧情", "大片抢先看", "片库", "观影", "优酷", "优酷土豆", "爱奇艺", "乐视", "电视追剧", "腾讯视频", "PPTV"];
    var excludeKeyWord = new RegExp('未完'); //排除不是影片的关键字
    var filmNameRegex = new RegExp("(《[^》]*》)|(\\<[^\\>]*\\>)", "g");
    var results = [];

    var isContains = false;
    for (var i = 0; i < keyWorldList.length; i++) {
        if (msgContent.indexOf(keyWorldList[i]) > -1) {
            isContains = true;
        }
    };
    if (!isContains) {
        return results;
    }

    msgContent.replace(filmNameRegex, function () {
        var arr = arguments;
        if (excludeKeyWord.test(arr[0])) {
            return;
        }
        result = {
            linkText: "film:" + arr[0],
            startIndex: arr[arr.length - 2],
            endIndex: arr[arr.length - 2] + arr[0].length
        };
        results.push(result);
    });

    return results;
}
//========================电影识别 end============================

//========================地址识别 start==========================
function getAddress(smsNumber, msgContent, smsReciveTime) {
    var keyWorldRegExp = new RegExp("(下载地址|邮箱地址|订购地址|升级地址|听课地址|观看地址|抢购地址|查询地址|红包地址|登录地址|网厅地址|页面地址|兑换地址|领卷地址|点击地址|充值地址|官方活动地址|二维码地址|核对地址|IP地址|地址下载|客户端地址|新闻地址|手机营业厅地址|掌上营业厅地址|直播地址|评价地址|账单地址|宽带地址|mail地址|官方地址|地址猛戳|地址请戳|电邮地址)", "g");
    var addressRegex = new RegExp("([^,，\\.。●\\*;；!！\\?？\\(（\\[【\\)）\\]】<>〈〉＜＞《》〔〕{}:：、\\+\\-－—_~～\\\"“”&=/→…　\\s在或到址个至唯买了由啊及的是因您位为不已等某变怎]{1,50}(?:科技园|软件园|幼儿园|电影城|营业[厅部]|专营店|交[叉汇]?[口处]|代办[点处]|代理点|零售点|终点站|加油站|服务[区台部]|家属区|旅游社|出入口|汽车园|(?:东北|西北|东南|西南)[角侧]|商业城|工业[园区]|办事处|建材城|办公区|商贸城|家乐福|变电站|派出所|路[\\d\\-]{1,10}号|路口|车站|单元|大[夏厦]|书吧|水吧|网吧|唱吧|水城|会所|通讯城?|酒店|饭店|公寓|别墅|车行|超市|[会礼]堂|[小大]学|中心(?:[a-zA-Z0-9]{1,10}区)?|门[口前市面]|[东南西北][大小\\d一二三四五六七八九]?门|[社园东南西北]区|\\d期|[分支]行|网点|银行|家居|数码|电器|医院|华庭|市政|[东南西北][园邻临城座坐段]|物流园|物流|[^无]广告|车库|集团|[商大]厦|百货|寓所|学校|办公|[\\d一二三四五六七八九]队|食堂|[校小][区院]|宿舍|委员?会(?:[\\u4e00-\\u9fa5]{1,10}[庄区宅])?|纪委|公司|厂房|[东西南北]口|[0-9a-zA-Z]座|[0-9a-zA-Z]+层|[0-9a-zA-Z一二三四五六七八九]栋|[0-9a-zA-Z]幢|桥[上下]|隔壁|激光|天地|花园|天虹|场坪|楼|厅|馆|室|旁|号[路门]?|[^年月日天]内|局|组|村(?:[\\u4e00-\\u9fa5\\d]{0,10}[边地屯傍组社号路弄山口])?|厂|场|府|店|对面|街)(?:[向往朝路]?(?:东|南|西|北|东北|西北|东南|西南|[\\u4e00-\\u9fa5]{0,10}方向|前)[行走侧门头]?(?:\\d{1,10}阶|[\\d一二三四五六七八九十百千万]{1,10}(?:米|公里)路[东南西北]|[\\d一二三四五六七八九十百千万]{1,10}(?:米|公里)|路[东南西北]|(?:东北|西北|东南|西南)角)|[\\u4e00-\\u9fa5]{1,10}大道)?)", "g");
    var results = [];

    var temp = msgContent.replace(keyWorldRegExp, "");
    if (temp.indexOf("地址") < 0) {
        return results;
    }

    msgContent.replace(addressRegex, function () {
        var arr = arguments;
        result = {
            linkText: "address:" + arr[0],
            startIndex: arr[arr.length - 2],
            endIndex: arr[arr.length - 2] + arr[0].length
        };
        var preIndex = result.startIndex >= 5 ? result.startIndex - 5 : 0;
        if (msgContent.substring(preIndex, result.startIndex).indexOf("地址") >= 0) {
            results.push(result);
        }
    });

    return results;
}
//========================地址识别 end============================

//========================电话号码识别 start========================
var getPhoneNumber = function (smsNumber, smsBody, receiveTime) {
    var globalRoaming, globalRoaming1, mobilePhone, fixedPhone48, fixedPhone3, fixedPhone4, fixedPhone1010, kd, callSharing, callSharingRegex, servicePhone, servicePhone6, chineseCharRegex, sequenceEnd, sequenceEndRegex, splitCharRegex, splitCharRegex1, chineseCharRegex, keyWord, keyWord1, keyWord2, keyWordRegex, keyWord1Regex, keyWord2Regex, oppositeKeyWord, oppositeKeyWordRegex, split1;
    keyWord = '详询|电话|致电|拨|打|拨打国内(?:人工)?长途|联系方式|手机|客服|电联|热线|收派员|来电|专线|T|Tel|咨询|费(?:先生|小姐|女士|老板)';
    keyWordRegex = new RegExp(keyWord);
    keyWord1 = '电话|手机';
    keyWord2 = '[^\\d]'; //反序列
    keyWord1Regex = new RegExp(keyWord1);
    keyWord2Regex = new RegExp(keyWord2, 'g'); //电话当中包含的特殊字符
    //	oppositeKeyWord = '单号|票码|信号|户号|认码|代码|编号|快件|订单|列号|众号|件号|密码|尾号|Q联|Q+|子码|票号|卡号|量|额|款|发送|要|账|预约号|第|费|请您对|微信|数|证码|票|证';
    oppositeKeyWord = '.{0,2}号|.{0,3}码|快件|订单|运单|Q联|Q+|量|额|款|发送|要|账|第|费|请您对|微信|数|票|证|度';
    oppositeKeyWordRegex = new RegExp(oppositeKeyWord);
    sequenceEndRegex = new RegExp('[0-9]');
    splitCharRegex = new RegExp('\\-', 'g');
    kd = '(?:(?:' + keyWord + ')[^\\d]{0,3})'; //关键字和距离keyword和distance
    split1 = '[\\-\\)）\\s]'; //区号与座机号码间的分隔符
    split1CharRegex = new RegExp('(\\d{4,4})[\\-\\)）\\s]?'); //匹配7位或8位座机号码前面是否存在区号
    //	splitCharRegex1 = new RegExp('\\-\\-');
    chineseCharRegex = new RegExp('[\\u4E00-\\u9FA5]', 'g');
    globalRoaming = '(\\+?(00)?(0?86)?-?)?'; //国际区号;
    globalRoamingRegex = new RegExp('86-?'); //匹配是否有86国际区号;
    mobilePhone = '1(3\\d{9,9}|(4[579]|5[0-35-9]|6[0678]|7[0135-8]|8\\d)\\d{8,8})' //手机号
    //            	var areaCode = '0(10\\d{8,8}|2[0-5789]\\d{8,8}|3(1\\d{8,8}|35\\d{7,7}|49\\d{7,7}|5\\d{8,8}|7[0-79]\\d{7,7}|9[1-8]\\d{7,7})|4(1[124-9]\\d{7,7}|2[179]\\d{7,7}|3[1-9]\\d{7,7}|5[1-9]\\d{7,7}|6[4789]\\d{7,7}|7\\d{8,8}|8[23]\\d{7,7})|5(1\\d{8,8}|2[37]\\d{7,7}|3\\d{8,8}|4[36]\\d{7,7}|5\\d{8,8}|6[1-46]\\d{7,7}|7\\d{8,8}|80\\d{7,7}|9[1-9]\\d{7,7})|6(16\\d{7,7}|3[1-5]\\d{7,7}|6[0238]\\d{7,7}|9[12]\\d{7,7})|7(1\\d{8,8}|2[0248]\\d{7,7}|3[014-9]\\d{7,7}|4[3-6]\\d{7,7}|5\\d{8,8}|6[023689]\\d{7,7}|7\\d{8,8}|9\\d{8,8})|8(1[023678]\\d{7,7}|2[567]\\d{7,7}|3\\d{8,8}|5[1-9]\\d{7,7}|7\\d{8,8}|8[3678]\\d{7,7}|9[1-8]\\d{7,7})|9(0[123689]\\d{7,7}|1[1-79]\\d{7,7}|3\\d{8,8}|4[13]\\d{7,7}|5[1-5]\\d{7,7}|7[0-79]\\d{7,7}|9\\d{8,8}))'
    callSharing = '(4|8)00[\\d\\-]{7,}';
    callSharingRegex = new RegExp(callSharing, 'g');
    //	fixedPhone48 = '[\\(（]?(?:0(?:311|371|377|379|411|451|512|510|513|516|531|532|571|574|577|591|595|755|757|769|898))[\\-\\)）\\s]?\\d{8,8}'
    fixedPhone1010 = '[\\(（]?1010-?\\d{4,4}'; //识别1010电话号码
    //	fixedPhone4 = '[\\(（]?(0(3(1[02-9]|35|49|5\\d|7[02-68]|9[1-8])|4(1[24-9]|2[179]|3[1-9]|5[2-9]|6[4789]|7\\d|8[23])|5(1[145789]|2[37]|3[03-9]|4[36]|5\\d|6[1-46]|7[0235689]|80|9[2346-9])|6(16|3[1-5]|6[0238]|9[12])|7(1\\d|2[0248]|3[014-9]|4[3-6]|5[0-4689]|6[02368]|7\\d|9\\d)|8(1[023678]|2[567]|3\\d|5[1-9]|7\\d|8[3678]|9[1-7])|9(0[123689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9\\d)))[\\-\\)）\\s]?\\d{7,7}';//四位区号固定电话
    //座机带有区号start
    fixedPhone48 = '[\\(（]?(?:0?(?:3(?:11|7[179])|4[135]1|51\\d|52[37]|53[12]|551|57[1345679]|59[15]|731|75[457]|769|791|760|8(?:5[12]|71|98)))' + split1 + '?\\d{8,8}'
    fixedPhone3 = '[\\(（]?(0?(10|2[0-5789]))' + split1 + '?\\d{8,8}'; //三位区号固定电话
    fixedPhone4 = '[\\(（]?(0?(3(1[02-9]|35|49|5\\d|7[02-68]|9[1-8])|4(1[24-9]|2[179]|3[2-9]|5[2-9]|6[4789]|7\\d|8[23])|5(3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2346-9])|6(16|3[1-5]|6[0238]|9[12])|7(1\\d|2[0248]|3[04-9]|4[3-6]|5[0-3689]|6[2368]|7\\d|9[02-9])|8(1[023678]|2[567]|3\\d|5[3-9]|7[02-9]|8[3678]|9[1-7])|9(0[123689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9\\d)))' + split1 + '?\\d{7,7}'; //四位区号固定电话
    //座机带有区号end
    servicePhone = '100[0-36][013689]|11185|12(1[12][0179]|3[0134569][035689]|580)|179[09][0189]|95[0135789][0-35-9]{2,2}|96(0[019][0-68]|1[0125-9][0-35-9]|300|968)';
    servicePhone6 = '(?:95[0246]|861)\\d{3,3}';
    //	emergencyCall = '(电话[^\\d]{0,3})11[0-79]|12[0126789]';
    emergencyCall = '(?:11[0-79]|12[0126789]|999)';
    globalRoaming1 = '((' + oppositeKeyWord + '|' + keyWord + ')[^\\d]{0,3})?' + globalRoaming;
    var regstr = globalRoaming1 + '(' + fixedPhone48 + '|' + mobilePhone + '|' + callSharing + '|' + fixedPhone3 + '|' + fixedPhone4 + '|' + kd + fixedPhone1010 + '|' + kd + '\\d{8,8}' + '|' + kd + '\\d{7,7}' + '|' + kd + servicePhone6 + '|' + kd + emergencyCall + ')' + '|' + globalRoaming1 + '(' + servicePhone + ')';
    //            	var regstr= '(\\+?(00)?86-?)?(1(3\\d{9,9}|(4[579]|5[0-35-9]|6[0678]|7[015-8]|8[0-9])\\d{8,8})|(4|8)00\\d\\-?\\d{3,3}\\-?\\d{3,3}|(0(3(1\\d|35|49|5\\d|7[0-79]|9[1-8])|4(1[124-9]|2[179]|3[1-9]|5[1-9]|6[4789]|7\\d|8[23])|5(1\\d|2[37]|3\\d|4[36]|5\\d|6[1-46]|7\\d|80|9[1-9])|6(16|3[1-5]|6[0238]|9[12])|7(1\\d|2[0248]|3[014-9]|4[3-6]|5\\d|6[023689]|7\\d|9\\d)|8(1[023678]|2[567]|3\\d|5[1-9]|7\\d|8[3678]|9[1-8])|9(0[123689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9\\d)))?\\d{7,7}|(0(10|2[0-5789]))?\\d{8,8}|100[023][013689]|12(1[12][0179]|3[1459][58])|955[89][08])';
    var phoneRegex = new RegExp(regstr, 'g');
    var arr = [];
    var type = 'tel';
    var obj, start, end, linkText, frontChart, backChart, content, matchIndex, keyLength, oppositeContent, arr1, arr2, arr3, arr4, text, text1, areaCode, globalCode, index, content1;
    smsBody.replace(phoneRegex, function () {
        content = arguments[0];
        matchIndex = arguments[arguments.length - 2];
        if (oppositeKeyWordRegex.test(content)) { //确定是反向关键字
            oppositeContent = arguments[1];
            if (!keyWord1Regex.test(oppositeContent) && !keyWordRegex.test(content)) { //如果反向关键字不是手机或者电话返回 并且不包含关键字
                return;
            }
        }
        arr4 = keyWordRegex.exec(content);
        if (arr4) { //有正向关键字
            index = arr4.index;
            content1 = content.substring(index + arr4[0].length);
            if (oppositeKeyWordRegex.test(content1) && index == 0) { //判断正向关键字与反向关键字距离电话号码最近,正向最近留下,反向最近扔掉
                return;
            }
            keyLength = sequenceEndRegex.exec(content).index;
        } else { //没有关键字
            keyLength = 0;
        }
        if ((content.length == 7 || content.length == 8) && matchIndex >= 4) { //必须是7位或8位座机号并且前面至少有4位
            areaCode = smsBody.substring(matchIndex - 5, matchIndex); //取出座机号码前面最多5位
            arr2 = split1CharRegex.exec(areaCode);
            if (arr2 && arr2[1].length == 4) return;
        }
        if (content.length == 10 && !callSharingRegex.test(content)) { //如果是10位座机号码看前面是否有86国际区号,如果有认为是电话
            callSharingRegex.lastIndex = 0; //将匹配索引重置为0
            globalCode = smsBody.substring(matchIndex - 3, matchIndex); //取出座机号码前面最多3位
            if (!globalRoamingRegex.test(globalCode)) return;
        }
        start = matchIndex + keyLength;
        linkText = content.substring(keyLength);
        end = start + linkText.length;
        frontChart = smsBody.substring(start - 1, start);
        backChart = smsBody.substring(end, end + 1);
        if (sequenceEndRegex.test(frontChart) || //校验号码开头和结尾
            sequenceEndRegex.test(backChart)) {
            return;
        }
        if (
            callSharingRegex.test(linkText)) { //校验400或者800后面的序列是否满足
            callSharingRegex.lastIndex = 0; //将匹配索引重置为0
            arr1 = callSharingRegex.exec(linkText);
            text = arr1 ? arr1[0] : linkText; //数组有值代表加86
            splitCharRegex.lastIndex = 0;
            text1 = text.replace(splitCharRegex, '');
            splitCharRegex.lastIndex = 0;
            if (text1.length != 10) { //不是10位并且不符合11位条件
                if (text1.length == 11 && splitCharRegex.test(text.substring(text.length - 2, text.length - 1))) { //如果是11位,并且倒数第二位是'-';
                    linkText = linkText.substring(0, text.length - 2);
                    end -= 2;
                } else {
                    return;
                }
            }
        }
        obj = {
            linkText: type + ':' + linkText.replace(keyWord2Regex, ''), //去掉电话好吗当中的+()-
            startIndex: start,
            endIndex: end,
            action: actionArr[5].value
        };
        arr.push(obj);
    });
    //        	}
    //        	console.timeEnd();
    return arr;
}
//========================电话号码识别 end==========================
//========================action字段值 start==========================
var actionArr = [
    /**
     * 通用操作  ：例如复制验证码
     */
    {
        name: 'OPERATION_BASIC',
        value: 1
    },
    /**
     * 跳转H5操作
     */
    {
        name: 'OPERATION_INTENT_H5',
        value: 2
    },
    /**
     * 打开App操作
     */
    {
        name: 'OPERATION_INTENT_APP',
        value: 3
    },
    /**
     * 跳转内部应用操作
     */
    {
        name: 'OPERATION_INTENT_APP_INNER',
        value: 4
    },
    /**
     * 发送短信
     */
    {
        name: 'OPERATION_SEND_SMS',
        value: 5
    },
    /**
     * 拨打电话
     */
    {
        name: 'OPERATION_CALL',
        value: 6
    },
    /**
     * 附近网点
     */
    {
        name: 'OPERSTION_NEAR',
        value: 7
    },
    /**
     * 路线操作（根据经纬度）
     */
    {
        name: 'OPERATION_WAY',
        value: 8
    },
    /**
     * 提醒操作
     */
    {
        name: 'OPERATION_CALANDER_REMIDER',
        value: 9
    },

    /**
     * 充流量
     */
    {
        name: 'OPERATION_DATA_TRAFFIC',
        value: 10
    },

    /**
     * 还款
     */
    {
        name: 'OPERATION_REPAYMENT',
        value: 11
    },

    /**
     * 充话费
     * @deprecated
     */
    {
        name: 'OPERATION_RECHARGE',
        value: 12
    },

    /**
     * 地图操作（根据地址名称）08-21
     */
    {
        name: 'OPERATION_MAP',
        value: 13
    },

    /**
     * 日程
     */
    {
        name: 'OPERATION_SCHEDULE',
        value: 14
    },

    /**
     * 发送邮件
     */
    {
        name: 'OPERATION_MAIL',
        value: 15
    },

]
//========================action字段值 end==========================
