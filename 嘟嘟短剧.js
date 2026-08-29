// @name 嘟嘟短剧
// @author 梦
// @description API 短剧站：https://api-v2.cenguigui.cn，支持分类、搜索、详情与多清晰度播放
// @version 1.0.1
// @downloadURL https://gh-proxy.org/https://github.com/Silent1566/OmniBox-Spider/raw/refs/heads/main/短剧/嘟嘟短剧.js

const OmniBox = require("omnibox_sdk");
const runner = require("spider_runner");

const BASE_URL = process.env.DUDU_DJ_HOST || "https://api-v2.cenguigui.cn";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const HEADERS = {
  "User-Agent": UA,
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9",
};

const CLASS_LIST = [
  { type_id: "热播", type_name: "🎬热播" },
  { type_id: "新剧", type_name: "🎬新剧" },
  { type_id: "都市", type_name: "🎬都市" },
  { type_id: "穿越", type_name: "🎬穿越" },
  { type_id: "重生", type_name: "🎬重生" },
  { type_id: "赘婿", type_name: "🎬赘婿" },
  { type_id: "逆袭", type_name: "🎬逆袭" },
  { type_id: "霸总", type_name: "🎬霸总" },
  { type_id: "职场", type_name: "🎬职场" },
  { type_id: "异能", type_name: "🎬异能" },
  { type_id: "神医", type_name: "🎬神医" },
  { type_id: "系统", type_name: "🎬系统" },
  { type_id: "总裁", type_name: "🎬总裁" },
  { type_id: "豪门", type_name: "🎬豪门" },
  { type_id: "神豪", type_name: "🎬神豪" },
  { type_id: "校园", type_name: "🎬校园" },
  { type_id: "青春", type_name: "🎬青春" },
  { type_id: "马甲", type_name: "🎬马甲" },
  { type_id: "年代", type_name: "🎬年代" },
  { type_id: "闪婚", type_name: "🎬闪婚" },
  { type_id: "战神", type_name: "🎬战神" },
  { type_id: "女主", type_name: "🎬女主" },
  { type_id: "修仙", type_name: "🎬修仙" },
  { type_id: "亲情", type_name: "🎬亲情" },
  { type_id: "虐恋", type_name: "🎬虐恋" },
  { type_id: "追妻", type_name: "🎬追妻" },
  { type_id: "萌宝", type_name: "🎬萌宝" },
  { type_id: "古风", type_name: "🎬古风" },
  { type_id: "传承", type_name: "🎬传承" },
  { type_id: "甜宠", type_name: "🎬甜宠" },
  { type_id: "奇幻", type_name: "🎬奇幻" },
  { type_id: "爱情", type_name: "🎬爱情" },
  { type_id: "乡村", type_name: "🎬乡村" },
  { type_id: "历史", type_name: "🎬历史" },
  { type_id: "王妃", type_name: "🎬王妃" },
  { type_id: "高手", type_name: "🎬高手" },
  { type_id: "娱乐", type_name: "🎬娱乐" },
  { type_id: "联合", type_name: "🎬联合" },
  { type_id: "破镜", type_name: "🎬破镜" },
  { type_id: "暗恋", type_name: "🎬暗恋" },
  { type_id: "民国", type_name: "🎬民国" },
  { type_id: "冤家", type_name: "🎬冤家" },
  { type_id: "真假", type_name: "🎬真假" },
  { type_id: "龙王", type_name: "🎬龙王" },
  { type_id: "穿书", type_name: "🎬穿书" },
  { type_id: "女帝", type_name: "🎬女帝" },
  { type_id: "团宠", type_name: "🎬团宠" },
  { type_id: "玄幻", type_name: "🎬玄幻" },
  { type_id: "仙侠", type_name: "🎬仙侠" },
  { type_id: "青梅", type_name: "🎬青梅" },
  { type_id: "悬疑", type_name: "🎬悬疑" },
  { type_id: "推理", type_name: "🎬推理" },
  { type_id: "皇后", type_name: "🎬皇后" },
  { type_id: "替身", type_name: "🎬替身" },
  { type_id: "大叔", type_name: "🎬大叔" },
  { type_id: "喜剧", type_name: "🎬喜剧" },
  { type_id: "剧情", type_name: "🎬剧情" },
];

module.exports = { home, category, detail, search, play };
runner.run(module.exports);

function getBodyText(res) {
  const body = res && typeof res === "object" && "body" in res ? res.body : res;
  if (Buffer.isBuffer(body) || body instanceof Uint8Array) return body.toString();
  return String(body || "");
}

function cleanTitle(text) {
  return String(text || "")
    .replace(/[【\[]热播(?:好剧|短剧)?[】\]]/g, "")
    .replace(/[【\[]新剧(?:热播)?[】\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson(url) {
  await OmniBox.log("info", `[嘟嘟短剧][request] ${url}`);
  const res = await OmniBox.request(url, {
    method: "GET",
    headers: HEADERS,
    timeout: 20000,
  });
  if (!res || Number(res.statusCode) < 200 || Number(res.statusCode) >= 400) {
    throw new Error(`HTTP ${res?.statusCode || "unknown"} @ ${url}`);
  }
  return JSON.parse(getBodyText(res) || "{}");
}

function mapVod(item = {}) {
  return {
    vod_id: String(item.id || ""),
    vod_name: cleanTitle(item.title || ""),
    vod_pic: String(item.cover || ""),
    vod_remarks: item.totalChapterNum ? `更新至${item.totalChapterNum}集` : "",
    type_id: "",
    type_name: "短剧",
  };
}

function sortQualities(list = []) {
  const priority = { "1080p": 3, sc: 2, sd: 1 };
  return [...list].sort((a, b) => (priority[String(b.quality || "")] || 0) - (priority[String(a.quality || "")] || 0));
}

async function home(params, context) {
  try {
    const url = `${BASE_URL}/api/duanju/baidu/?name=${encodeURIComponent("热播")}&page=1`;
    const obj = await fetchJson(url);
    const list = Array.isArray(obj.data) ? obj.data.map(mapVod) : [];
    await OmniBox.log("info", `[嘟嘟短剧][home] list=${list.length}`);
    return { class: CLASS_LIST, list };
  } catch (e) {
    await OmniBox.log("error", `[嘟嘟短剧][home] ${e.message}`);
    return { class: CLASS_LIST, list: [] };
  }
}

async function category(params, context) {
  try {
    const tid = String(params.categoryId || params.type_id || "热播");
    const page = Math.max(1, parseInt(params.page || 1, 10));
    const url = `${BASE_URL}/api/duanju/baidu/?name=${encodeURIComponent(tid)}&page=${page}`;
    const obj = await fetchJson(url);
    const list = Array.isArray(obj.data) ? obj.data.map(mapVod) : [];
    await OmniBox.log("info", `[嘟嘟短剧][category] tid=${tid} page=${page} list=${list.length}`);
    return {
      page,
      pagecount: page + (list.length >= 14 ? 1 : 0),
      total: page * 14 + (list.length >= 14 ? 1 : 0),
      list,
    };
  } catch (e) {
    await OmniBox.log("error", `[嘟嘟短剧][category] ${e.message}`);
    return { page: 1, pagecount: 0, total: 0, list: [] };
  }
}

async function detail(params, context) {
  try {
    const id = String(params.videoId || params.id || "").trim();
    if (!id) return { list: [] };
    const url = `${BASE_URL}/api/duanju/baidu/?id=${encodeURIComponent(id)}`;
    const obj = await fetchJson(url);
    const episodesRaw = Array.isArray(obj.data) ? obj.data : [];
    if (!episodesRaw.length) return { list: [] };

    const first = episodesRaw[0] || {};
    const titleRaw = String(first.title || "");
    const vodName = cleanTitle(titleRaw.replace(/\s+\d+\s*$/, ""));
    const vodPic = String(first.cover || "");
    const episodes = episodesRaw.map((item, idx) => ({
      name: cleanTitle(String(item.title || `第${idx + 1}集`)),
      playId: String(item.video_id || ""),
    })).filter((item) => item.playId);

    return {
      list: [{
        vod_id: id,
        vod_name: vodName,
        vod_pic: vodPic,
        vod_year: "",
        vod_area: "中国",
        vod_remarks: `更新至${episodes.length}集`,
        vod_content: `${vodName} 短剧，共 ${episodes.length} 集`,
        vod_play_sources: episodes.length ? [{ name: "嘟嘟短剧", episodes }] : [],
      }],
    };
  } catch (e) {
    await OmniBox.log("error", `[嘟嘟短剧][detail] ${e.message}`);
    return { list: [] };
  }
}

async function search(params, context) {
  try {
    const keyword = String(params.keyword || params.wd || params.key || "").trim();
    const page = Math.max(1, parseInt(params.page || 1, 10));
    if (!keyword) return { page, pagecount: 0, total: 0, list: [] };
    const url = `${BASE_URL}/api/duanju/baidu/?name=${encodeURIComponent(keyword)}&page=${page}`;
    const obj = await fetchJson(url);
    const list = Array.isArray(obj.data) ? obj.data.map(mapVod) : [];
    await OmniBox.log("info", `[嘟嘟短剧][search] keyword=${keyword} page=${page} list=${list.length}`);
    return {
      page,
      pagecount: page + (list.length >= 14 ? 1 : 0),
      total: page * 14 + (list.length >= 14 ? 1 : 0),
      list,
    };
  } catch (e) {
    await OmniBox.log("error", `[嘟嘟短剧][search] ${e.message}`);
    return { page: 1, pagecount: 0, total: 0, list: [] };
  }
}

async function play(params, context) {
  try {
    const flag = String(params.flag || "");
    const videoId = String(params.playId || params.id || "").trim();
    if (!videoId) throw new Error("播放参数为空");
    const url = `${BASE_URL}/api/duanju/baidu/?video_id=${encodeURIComponent(videoId)}`;
    const obj = await fetchJson(url);
    const qualities = sortQualities((((obj || {}).data || {}).qualities) || []);
    const urls = [];
    for (const q of qualities) {
      const playUrl = String(q.download_url || "").trim();
      if (!playUrl) continue;
      urls.push({ name: String(q.title || q.quality || "播放"), url: playUrl });
    }
    return {
      parse: 0,
      urls,
      flag,
      header: {},
    };
  } catch (e) {
    await OmniBox.log("error", `[嘟嘟短剧][play] ${e.message}`);
    return { parse: 0, urls: [], flag: String(params.flag || ""), header: {} };
  }
}
