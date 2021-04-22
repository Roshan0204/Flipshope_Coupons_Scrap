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
            
            // console.log(date.format(currDate,"DD MM"))
            // const size = await page.evaluate(() => {
            //     var list=document.querySelectorAll(`div.gmc-cl>ul.gmc-list>li>div>ul>li.c-show-det`);
            //     console.log(list,"list")
            //     return list;
            // });
            
            try{
                // await page.click("div.gmc-cl>ul.gmc-list>li>div>ul>li.c-show-det")
                // let elements="";
                // await page.evaluate(() => {
                //     elements = document.getElementsByClassName('div.gmc-cl>ul.gmc-list>li>div>ul>li.c-show-det');
                //     console.log(elements)
                // })
                // console.log(elements)
                // console.log('how many?', (await page.$$('li.c-show-det')).length)
                const size= (await page.$$('li.c-show-det')).length;
                console.log("...................",size)
                    for(var tt=1;tt<=size;tt++){
                        try{
                        await page.click(`div.gmc-cl>ul.gmc-list>li:nth-child(${tt})>div>ul>li.c-show-det`)
                            
                    }
                        catch(e){
                            console.log("error",e)
                        }
                        // await page.waitFor(2000);
                        console.log(tt)
                    }
                //     for (let element of elements){
                //          page.waitFor(2000);
                //         element.click();
                //     }
                // })

                await page.waitFor(3000);
                // await page.evaluate(() => {
                //     let elements = $('div.gmc-cl>ul.gmc-list>li>div>ul>li.c-show-det').toArray();
                //     for (i = 0; i < elements.length; i++) {
                //       $(elements[i]).click();
                //     }
                //  });
          items = await page.evaluate(() => {
              
                console.log("........inside...........")
                var productNodeList = document.querySelectorAll(`div.gmc-cl>ul.gmc-list>li`);
                var storeNodeList = document.querySelectorAll(`ul.gmc-list>li>div>div>div>span.bl-0`);
                
                
                // console.log(codeNodeList);
                var result=[];
                
                for (var i = 0; i < productNodeList.length; i++) {
                    var desc=[];
                    var specs=[];
                    // let elements = document.getElementsByClassName('div.gmc-cl>ul.gmc-list>li>div>ul>li.c-show-det');
                    
                    //     elements[i+1].click();
                    // let element=productNodeList[i].getElementsByClassName(`div>ul>li.c-show-det`);
                    // element.click();
                    var descList = productNodeList[i].querySelectorAll(`div>div.gcb-det.open>ol`);
                    var specList = productNodeList[i].querySelectorAll(`div>div.gcb-det.open>div>table>tbody>tr`);
                    // alert(JSON.stringify(specList))
                    for(var j=0;j<descList.length;j++){
                      if((descList[j].querySelector(`li`).innerText.trim()) !== null){
                          try{
                        desc[j] = descList[j].querySelector(`li`).innerText.trim()
                          }catch(e){

                          }
                      }
                    }
                    for(var k=1;k<specList.length;k++){
                        if((specList[k].innerText.trim()) !==null){
                        specs[k] = specList[k].innerText.trim()
                        }
                    }
                    // descList.map((item)=>{
                    //     desc.push(item.querySelector(`span`).innerText.trim())
                    // })
                    var valid="";
                    var store="";
                    var title="";
                    var shortTitle="";
                    var lastVerified="";
                    var todayUsedBy="";
                    try{
                   valid= productNodeList[i].querySelector(`div>ul.veri>li.visible-lg.c-clk`).innerText.trim()
                    }catch(e){

                    }
                    try{
                        store= storeNodeList[i].querySelector('img').getAttribute('alt')
                         }catch(e){
                        store=document.querySelector("div.gm-mrd>h1").innerText.trim().split(" ")[0]
                         }
                         try{
                            title= productNodeList[i].querySelector(`div>div.gcbr.go-cpn-show.go-cpy>p`).innerText.trim()
                             }catch(e){
         
                             }
                             try{
                                shortTitle= productNodeList[i].querySelector(`div>div>div.bank>span`).innerText.trim()
                                 }catch(e){
             
                                 }
                                 try{
                                 code= productNodeList[i].querySelector(`div>div.gcbr.go-cpn-show.go-cpy>div.gcbr-r>span.cbtn>span.visible-lg`).innerText.trim()
                                     }catch(e){
                 
                                     }
                                     if(code !==null){
                  result[i] = {
                    store,
                    title,
                    shortTitle,
                    code,
                    short_desc:specs,
                    description:desc,
                    expiry_date:valid
                    // day: date.format(currDate,"DD MM YYYY")
                  };
                }
                }
                return result;
              });
            } catch(e){
                console.log("error",e);
            }
            // console.log(items)
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
