templates=templates||{};templates.page=templates.page||{};templates.page.optimizer=templates.page.optimizer||{};(function(){var k=devhd.i18n.L,b=devhd.i18n.$L,g=[],h="",m=templates.page.optimizer;function j(p){var o=arguments,n;for(n=1;n<o.length;n++){p.push(o[n])}}var l,e,d,c,f,a;try{l=function(n){return devhd.s3("images/"+n)};a=function(n){return devhd.x2("images/"+n)
};e=devhd.str.toSafeHTML;d=devhd.str.toSafeAttr;c=devhd.str.stripTags;f=devhd.str.toJsEsc}catch(i){}m.title=function(o){var n=[];j(n,g[0],o||"",g[1]);return n.join(h)};m.layout=function(q){var p=[];for(var o in q){j(p,g[2],o,g[3]);var n=q[o];j(p,g[4]);for(var r=0;r<n.length;r++){j(p,g[5],n[r].getTitle(),g[6]);if(n[r].isGem()){j(p,g[7])}j(p,g[8],n[r].getEngagement(),g[9],n[r].getPotential(),g[9],n[r].getAge()<1?Math.ceil(n[r].getAge()*100)/100:Math.ceil(n[r].getAge()),g[10])
}j(p,g[11])}return p.join(h)};g=[' \nOptimizer <span class="hhint">'," cached articles</span> \n"," <h2>","</h2> \n",' <table style="font-size: 12px" border="0"> \n',' <tr valign="top"> \n<td style="padding-bottom:3px; width: 700px"> \n'," \n"," <b>gem</b> \n",' </td> \n<td style="padding-bottom:3px; width: 100px"> \n',' \n</td> \n<td style="padding-bottom:3px; width: 100px"> \n',"h \n</td> \n</tr> \n"," </table> \n"]
})();