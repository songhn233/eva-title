
const htmlEl = document.documentElement;

htmlEl.setAttribute('data-is-chrome',isChrome);

const style = document.createElement('style');
document.head.appendChild(style);
// let fontAPI = 'http://192.168.31.7:8003/api/fontmin';
let fontAPI = 'https://lab.magiconch.com/api/fontmin';

// fontAPI = 'https://s6.magiconch.com/api/fontmin';
fontAPI = 'http://localhost:60912/api/fontmin';

// fontAPI = 'https://eva-title-server.vercel.app/api/fontmin';

const blockMojiRegex = /\s/g;
const getFontFromText = (name,text,onOver=_=>{})=>{
    if(!text) return onOver();
    text = text.replace(blockMojiRegex,'');
    text += '0';
    text = Array.from(new Set(text)).sort().join('');
    // console.log(str2utf8(text))
    // console.log(utf82str(str2utf8(text)))
    text = diffDefaultMoji(text);
    // console.log({text})
    if(!text) return onOver();

    const unicode = str2utf8(text).join();
    const fontURL = `${fontAPI}?name=${name}&unicode=${unicode}`;

    loadFont(name,fontURL,_=>{
        onOver(_)
        // style.innerHTML = `html {font-family: a123;}`;
    })
}
const loadFont = async (fontName,fontURL,callback) => {
	const fontFace = new FontFace(fontName, `url(${fontURL})`);
	fontFace.load().then(fontFace => {
		document.fonts.add(fontFace);
		callback(fontFace);
	}).catch(e=>{
        // console.log(e);
        callback();
    })
};
function str2utf8(str) {
    return str.split('').map(s=>s.charCodeAt(0))
}
function utf82str(str) {
    return String.fromCharCode.apply(null,Array.from(str))
}


const deepCopy=o=>JSON.parse(JSON.stringify(o));

const inputEl = document.querySelector('textarea');
const checkboxEl = document.querySelector('input');
const outputEl = document.querySelector('#out');



const getMoji = _=>{
    let v = layouts.map(a=>[a.inputs.map(t=>t.placeholder),a.exemples]).flat().join();
    // console.log(v)
    // v += document.querySelector('body').textContent;
    return v;
};

let defaultMoji = Array.from(new Set(getMoji())).sort();

// console.log(defaultMoji.join(''));

// if(ios || !isChrome){
//     defaultMoji = [];
// }
defaultMoji = ' \n,-./01235789:?ABCDEFGHILMNOPRSTUVabcdefghijklmnoprstuvwxyz“”、。「」いかくけげしせただちてでとなのはめもらるわをんアイカグシスゼダネバフマルレー一下不世中了京人今他伍作使來例価侵値僅先入八六其决况出到劳化匹博原参參叫可吃問喜嘗嘘器噪嚴四在型士壱太奇字存实室實市座庵弐当後徒微心情成我战戦戰拾持掃授排換支攷文新日明替最权来東案桌森標模樣歡求決沈浏海瀏版生用界發的監看督石神福秀章端第糊系終繁纪统网者臭螺襲覽览試話誕請议请跡輸轉逃选遇還郎配重野銳键間雨雷電面音頭題页项香驗验體魂鳴麦黙點🏼👩！，'.split('');

// const unicode = str2utf8(defaultMoji.join('')).join();
// console.log(unicode)
const diffDefaultMoji = text=>{
    return text.split('').filter(moji=>!defaultMoji.includes(moji)).join('').replace(/\s/g,'')
};

const c = _=>{
    loadFont('baseSplit','base-split.woff',async _=>{
        getFontFromText(fontFamilyName,getMoji(),async _=>{
            layouts.slice().sort(_=>-1).forEach((layout,index)=>{
                let texts = [
                    // '使徒',
                    // '襲来',
                    // '第壱話',
                ];
                texts = layout.inputs.map((input,index)=>{
                    return texts[index] || input.placeholder
                })
                const height = 240;
                const config = Object.assign({},defaultConfig,layout.config,{
                    height,
                    // convolute: true,
                    noise:false,
                    blur:1,
                    // inverse: Math.random()>0.9,
                });
                const el = make({
                    texts,
                    config,
                    layout
                })
                const src = makeBMPFormCanvas(el)
                layout.src = src;
                // console.log(src)
                // app.$set(layout,'src',src)
                // outputEl.appendChild(el)

                // if(layout.exemples){
                //     layout.exemples.forEach(texts=>{
                //         const el = make({
                //             texts,
                //             config,
                //             layout
                //         })
                //         // outputEl.appendChild(el)
                //     })
                // }
            })
            app.layouts = layouts;

        })
    })
}

c();

const texts = [
    '',
    '',
    '',
    '',
]
const defaultConfig = {
    blur:true,
    height:480,
    shadow:true,
    convolute: false,
    retina:true,
    plan:undefined,
    noise:false,
    // inverse:false,// Math.random()>0.9,
};
const types = [
    {
        value: undefined,
        text:'DVD'
    },
    {
        value: 95,
        text: '95'
    }
]
const plans = [
    {
        value:undefined,
        text:'黑底'
    },
    {
        value:'white',
        text:'白底'
    },
    {
        value:'red',
        text:'红字'
    }
]
const data ={
    layout:null,
    layouts:[],
    config:deepCopy(defaultConfig),
    texts,
    loading:false,
    lastAllText:''
};
const Layouts = {}
layouts.forEach(layout=>{
    Layouts[layout.id] = layout;
});

const defaultTitle = document.title;


const textOrigin = '扫袭';
const textBefore = '掃襲';

const textFilter = text=>{
    return text;
};

const app = new Vue({
    el:'.app',
    data,
    methods:{
        make(){
            clearTimeout(make.timer);

            make.timer = setTimeout(_=>{
                const texts = this.layout.inputs.map((input,index)=>{
                    const {type} = input;
                    if(type==='tab'){
                        return this.texts[index];
                    }
                    return textFilter(this.texts[index] || input.placeholder)
                });

                this.loading = true;
                getFontFromText(fontFamilyName,texts.join(''), _=>{
                    make({
                        outputCanvas: this.$refs['canvas'],
                        texts,
                        config: this.config,
                        layout: this.layout
                    });
                    this.loading = false;
                    this.lastAllText = this.allText;
                });
            },200);
        },
        setLayout(_layout,noRoute){
            this.layout = _layout;
            const {inputs,config} = _layout;
            // console.log(Object.assign({},defaultConfig,config))
            this.config = Object.assign({},defaultConfig,config);
            this.setDefaultTexts(_layout);

            const { id } = _layout;

            const title = `${_layout.title} - ${defaultTitle}`;

            document.title = title;
            this.make();

            if(!noRoute) history.replaceState({}, title, `./?layout=${encodeURIComponent(id)}`);
        },
        setExemple(exemple){
            // console.log({exemple})
            exemple.forEach((t,i)=>{
                // this.texts[i]=t
                this.$set(this.texts,i,t);
            });
            this.make();
        },
        setDefaultTexts(layout){
            const {inputs} = layout;
            this.texts = inputs.map(input=>{
                const {type} = input;
                if(type === 'tab'){
                    return 0//input.options[0]
                }
                return '';
            })
        },
        save(){
            const {canvas} = this.$refs;
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg',.95);
            a.download = `[lab.magiconch.com][福音戰士標題生成器]-${+Date.now()}.jpg`;
            a.click();
        },
        tc(){
            this.texts = this.texts.map(transformFunc[2]);
            this.make();
        }
    },
    computed:{
        allText(){
            return this.layout.inputs.map((input,index)=>{
                const {type} = input;
                if(type==='tab') return '';
                return this.texts[index] || input.placeholder
            }).join(',');
        },
        canTc(){
            return this.texts.join() !== transformFunc[2](this.texts.join())
        },
        noMatchMojis(){
            return Array.from(new Set(this.allText)).sort().filter(m=>!EVAMatisseClassicMojis.includes(m))
        }
    },
    watch:{
        config:{
            deep:true,
            handler:'make'
        },
        layout:'make',
        // texts:{
        //     deep:true,
        //     handler:'make'
        // },
    }
})




const getQuerys = _=>{
	const GET = {};
	let queryString = location.search.slice(1);
	if(queryString){
		let gets = queryString.split(/&/g);
		gets.forEach(get=>{
			let [k,v] = get.split(/=/);
			GET[decodeURIComponent(k)] = decodeURIComponent(v);
		})
	};
	return GET
};





const GET = getQuerys();
const layoutId = GET['layout'] || 'e1';
if(Layouts[layoutId]){
    app.setLayout(Layouts[layoutId],1);
}
