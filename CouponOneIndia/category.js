const puppeteer = require('puppeteer')
const fs = require('fs');
const R = require('rambda');

let baseURL =[{url:'https://coupons.oneindia.com/all-shops'},{url:'https://coupons.oneindia.com/'}];
let category = [];
let inst =1;
let newLinks =[];
const resolution = {
    x: 1920,
    y: 1080,
}
let selectors;

const args = [
    '--disable-gpu',
    `--window-size=${resolution.x},${resolution.y}`,
    '--no-sandbox',
]
const splitter = (arr, len) => {
    var a = arr;
    var i = 0;
    let split = a.length / len;
    while (a.length) {
        if (newLinks[i]) {
            let b = a.splice(0, split);
            b.map(item => {
                newLinks[i].push(item);
            })
        }
        else {
            newLinks[i] = a.splice(0, split);
        }
        if (i < len - 1)
            i++;
    }
}

getCategory = async (index) => {
    const browser = await puppeteer.launch({
        headless: false,
        handleSIGINT: false,
        args: args,
    });
    const page = await browser.newPage()

    await page.setViewport({
        width: resolution.x,
        height: resolution.y,
    })
    
    for (let catUrl of newLinks[index]) {
    await page.goto(catUrl.url, { waitUntil: 'networkidle0', timeout: 0 });
    try{
    let data = await page.$$eval(selectors.category, assetLinks => assetLinks.map(links => links.href));
    data.map(item => {
        category.push({ 'url': item });
    })
    let data1 = await page.$$eval(selectors.category1, assetLinks => assetLinks.map(links => links.data-gtm-target-url));
    data1.map(item => {
        category.push({ 'url': item });
    })
}catch(e){}
}
    fs.writeFileSync('category.json', JSON.stringify(category));
    await page.close();
    await browser.close();
}
const fn = async () => {
    const promised = R.range(0, inst).map((a, index) => getCategory(index));
    await Promise.all(promised)

    console.log('DONE')
}
(async () => {
    let sel = fs.readFileSync('manage.json', 'UTF-8');
    selectors = JSON.parse(sel);
    // category = JSON.parse(selectors.baseURL);
    splitter(baseURL, inst);
    // await getCategory();
    fn();
    
})();
