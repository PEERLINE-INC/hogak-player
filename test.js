import { mediaStreamValidator } from "media-stream-validator";

const streamUri = "https://d2j2bdn9xkbpxt.cloudfront.net/ac55a8f88196a63d730b1157735fc8b2/0_hd_hls.m3u8?hlsid=HTTP_ID_1";

(async () => {
    const results = await mediaStreamValidator(streamUri);
    console.log(results);
})();