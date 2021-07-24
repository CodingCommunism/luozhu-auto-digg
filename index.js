const superagent = require('superagent');
const COOKIE = '_ga=GA1.2.872653535.1621568173; n_mh=8nf0n1es-yxlh7tK7pQu4MpZBa1P38U7JXLJ9-I_ahc; _tea_utm_cache_2608={%22utm_source%22:%22web%22%2C%22utm_medium%22:%22juejin_entrance%22%2C%22utm_campaign%22:%22news%22}; passport_csrf_token_default=b59597ff70875a404c15452977af3cc6; passport_csrf_token=b59597ff70875a404c15452977af3cc6; passport_auth_status=da61b7faf4b9d5e6f5e9b144ae15788f%2C; passport_auth_status_ss=da61b7faf4b9d5e6f5e9b144ae15788f%2C; sid_guard=0c0f8aeec0cf1f87d4e7410ee5d12a1b%7C1626758771%7C5184000%7CSat%2C+18-Sep-2021+05%3A26%3A11+GMT; uid_tt=3635261cde734de35e86c5dae36e5d20; uid_tt_ss=3635261cde734de35e86c5dae36e5d20; sid_tt=0c0f8aeec0cf1f87d4e7410ee5d12a1b; sessionid=0c0f8aeec0cf1f87d4e7410ee5d12a1b; sessionid_ss=0c0f8aeec0cf1f87d4e7410ee5d12a1b; MONITOR_WEB_ID=c5f8bad6-914c-4773-8682-98524437bf02; _gid=GA1.2.1696799354.1626931071; _gat=1';
const LV5_POWER = 10000;
const THRESHIOLD_VALUE = 20;
const NEARLY_DELAY = 5000;
const UN_NEARLY_DELAY = 60000;

const computedPower = (digg, view) => {
    return digg + Math.floor(view / 100);
}

const getLuoZhuPower = async () => {
    const resData = await superagent.get('https://api.juejin.cn/user_api/v1/user/get?aid=2608&user_id=325111174662855&not_self=1'); 
    const { got_digg_count, got_view_count } = JSON.parse(resData.text).data;
    return computedPower(got_digg_count, got_view_count);
}

const diggLuoZhu = () => {
    superagent.post('https://api.juejin.cn/interact_api/v1/digg/save').send({
        client_type: 2608,
        item_id: "6983854006124675108",
        item_type: 2 
    }).set('Cookie', COOKIE);
}

const getIsNearly = (luozhuPower) => {
    if( LV5_POWER - luozhuPower <= THRESHIOLD_VALUE ) return true;
    return false;
}

const getDelayTime = (isNearly) => {
    if(isNearly) return NEARLY_DELAY;
    return UN_NEARLY_DELAY;
}

const generateDigg = async () => {
    let luozhuPower = await getLuoZhuPower();
    let isNearly = getIsNearly(luozhuPower);
    setTimeout(() => {
        if(luozhuPower == LV5_POWER - 1) {
            diggLuoZhu();
        } else {
            generateDigg();
        }
    }, getDelayTime(isNearly));
    
}

generateDigg();
