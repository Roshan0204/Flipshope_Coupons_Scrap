const puppeteer = require('puppeteer')
const R = require('rambda');
const fs = require('fs');
const date = require("date-and-time")
var currDate = new Date();
let inst = 5;
let newLinks = [];
let selectors;
let category = [];
const resolution = {
    x: 1920,
    y: 1080,
}

const args = [
    '--disable-gpu',
    `--window-size=${resolution.x},${resolution.y}`,
    '--no-sandbox',
]

async function scrapeInfiniteScrollItems(
    page,
    itemTargetCount,
    scrollDelay = 2000,
) {
    let items = [];
    let test = [];
    let count = 0;
    try {
        let previousHeight;
        while (itemTargetCount == null || items.length < itemTargetCount) {
            // items = await page.$$eval(selectors.product, assetLinks=>assetLinks.map(links=>(links.href)));
            console.log("...................")
            console.log(date.format(currDate,"DD MM"))
            try{
          items = await page.evaluate(() => {
              
                console.log("........inside...........")
                var productNodeList = document.querySelectorAll(`div.offer-card-wrapper`);
                var codeNodeList = document.querySelectorAll(`div.offer-card-wrapper > div > div.card-content-top > div.get-codebtn-holder`);
                
                
                console.log(codeNodeList);
                var result=[];
                
                for (var i = 0; i < productNodeList.length; i++) {
                    var desc=[];
                    var title="";
                    var store="";
                    var shortTitle="";
                    var code="";
                    var lastVerified="";
                    var todayUsedBy="";
                    var expiry_date="";
                    var short_desc="";
                    var descList = productNodeList[i].querySelectorAll(`div > div.card-content-bottom > div.offer-desc > span > ol > li`);
                    // alert(JSON.stringify(descList))
                    for(var j=0;j<descList.length;j++){
                        try{
                        desc[j] = descList[j].querySelector(`span`).innerText.trim()
                        }catch(e){}
                    }
                    try{
                        store= productNodeList[i].querySelector(`div > div.card-content-top > div.horizontal_online_content > a:nth-child(1) > span`).innerText.trim()
                    }catch(e){}
                    try{
                        title= productNodeList[i].querySelector(`div > div.card-content-top > div.horizontal_online_content > a:nth-child(2) > div`).innerText.trim()
                    }catch(e){}
                    try{
                        shortTitle= productNodeList[i].querySelector(`div > div.cashback-tile > div`).innerText.trim()
                    }catch(e){}
                    try{
                        code= codeNodeList[i].querySelector('div').getAttribute('data-offer-value')
                    }catch(e){}
                    try{
                        lastVerified= productNodeList[i].querySelector(`div > div.card-content-top > div.title-meta > span.coupon-verification`).innerText.trim()
                    }catch(e){}
                    try{
                        todayUsedBy = productNodeList[i].querySelector(`div > div.card-content-top > div.title-meta > span.coupon-num-uses`).innerText.trim()
                    }catch(e){}
                   
                    if(code !==null){
                  result[i] = {
                    store,
                    title,
                    shortTitle,
                    code,
                    short_desc,
                    description: desc,
                    expiry_date
                    // day: date.format(currDate,"DD MM YYYY")
                  };
                }
                }
                return result;
              });
            } catch(e){
                console.log("error",e);
            }
            console.log(items)
            test = items;
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            console.log("Scrolled to bottom!", count)
            try {
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, { timeout: 2000 });
                count = 0;
                console.log("More products found")
            }
            catch{
                try {
                    await page.$eval(selectors.showMore, ele => ele.click());
                    count++;
                    console.log("Found show more button");
                    if (count > 1) {
                        throw "err";
                    }
                }
                catch (err) {
                    console.log("No more products")
                    throw err;
                }
            }
            await page.waitFor(scrollDelay);
        }
    } catch (e) { }
    return test;
}

const work = async (index) => {
    const browser = await puppeteer.launch({
        headless: selectors.headless,
        handleSIGINT: false,
        args: args,
    });
    const page = await browser.newPage()

    await page.setViewport({
        width: resolution.x,
        height: resolution.y,
    })
    for (let catUrl of newLinks[index]) {
        data = fs.readFileSync('coupon.json');
        json = JSON.parse(data);
        await page.goto(catUrl.url, { timeout: 0 });
        let products = await scrapeInfiniteScrollItems(page);
        products.map((item) => {
            if(item !==null){
            json.push(item);
            }
        })
        fs.writeFileSync('coupon.json', JSON.stringify(json));
    }
    await page.close();
    await browser.close();
    return;
}
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
const fn = async () => {
    const promised = R.range(0, inst).map((a, index) => work(index));
    await Promise.all(promised)

    console.log('DONE')
}
(async () => {
    let sel = fs.readFileSync('manage.json', 'UTF-8');
    selectors = JSON.parse(sel);
    inst = selectors.instances;
    let data = fs.readFileSync('category.json', 'UTF-8');
    category = JSON.parse(data);
    splitter(category, inst);
    fn();
})();
