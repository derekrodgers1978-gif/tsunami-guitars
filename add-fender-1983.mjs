import fs from 'fs';
const path='tsunami-guitars/guitars.json';
const data=JSON.parse(fs.readFileSync(path,'utf8'));
const id='fender-usa-standard-stratocaster-2-knob-1983';
if(!data.guitars.some(g=>g.id===id)){
  data.guitars.unshift({
    id,
    status:'available',
    brand:'Fender',
    model:'USA Standard Stratocaster 2-Knob',
    year:'1983',
    title:'Fender USA Standard Stratocaster',
    subtitle:'2-Knob · Sunburst · Original Fender Hardshell Case',
    eyebrow:'1983 · Made in USA · Short-Lived 2-Knob Era',
    badge:'Exceptionally Clean Vintage Example',
    price:'CA$2,299',
    price_num:2299,
    stripe:'mailto:tsunamiguitarshop@gmail.com?subject=Purchase%20Inquiry%3A%201983%20Fender%20USA%20Standard%20Stratocaster%202-Knob',
    meta_title:'1983 Fender USA Standard Stratocaster 2-Knob Sunburst | Tsunami Guitars',
    meta_desc:'Exceptionally clean 1983 Fender USA Standard Stratocaster from the short-lived two-knob era. Sunburst, maple neck, Freeflyte tremolo and original Fender hardshell case. CA$2,299.',
    description:'A beautiful 1983 Fender USA Standard Stratocaster from one of the shortest and most instantly recognizable chapters in Fender history. Built during the brief 1983–84 two-knob era, this American-made Strat features the distinctive Volume/Tone control layout, top-mounted output jack and Freeflyte tremolo system — a design Fender used for only a short time before the company entered its next chapter. What really sets this one apart is the condition. After more than four decades it remains exceptionally clean, with a gorgeous sunburst finish, remarkably clean maple neck and fingerboard, and excellent frets showing virtually no noticeable wear. There are only minor signs of handling and use, without the heavy buckle rash, chewed-up frets and general bar-fight history that so many early-80s Strats have collected. Serial number E3 344655. The guitar retains its period-correct hardware and original two-knob configuration and includes its original Fender hardshell case. It is a proper vintage USA Strat you can actually play without hesitation, while being clean and unusual enough to satisfy the collector who wants something a little different from the usual Strat hanging on every wall.',
    specs:[
      ['Year','1983'],['Model','USA Standard Stratocaster'],['Finish','Sunburst'],['Serial','E3 344655'],['Made In','USA'],['Neck / Fingerboard','Maple / Maple'],['Frets','21 · Excellent Condition'],['Pickups','Three Single-Coils'],['Selector','5-Way'],['Controls','2-Knob · Volume / Tone'],['Tremolo','Freeflyte'],['Output Jack','Top-Mounted'],['Condition','Excellent · Very Little Play Wear'],['Includes','Original Fender Hardshell Case']
    ],
    images:[],
    tags:['fender','stratocaster','usa','1983','2-knob','freeflyte','sunburst','vintage'],
    on_sale:false
  });
  fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
