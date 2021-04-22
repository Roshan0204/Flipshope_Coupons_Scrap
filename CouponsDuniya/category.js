const puppeteer = require('puppeteer')
const fs = require('fs');

let baseURL = 'https://www.coupondunia.in/categories';
let category = [];
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


getCategory = async () => {
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
    await page.goto(baseURL, { waitUntil: 'networkidle0', timeout: 0 });
    let data = await page.$$eval(selectors.category, assetLinks => assetLinks.map(links => links.href));
    data.map(item => {
        category.push({ 'url': item });
    })
    await page.close();
    await browser.close();
}
(async () => {
    let sel = fs.readFileSync('manage.json', 'UTF-8');
    selectors = JSON.parse(sel);
    await getCategory();
    fs.writeFileSync('category.json', JSON.stringify(category));
})();
