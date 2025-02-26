const tinycolor = require("tinycolor2");
module.exports = (opts) => {
  console.log(opts);


  let stored = {
    "Bg": null,
    "BgHov": null,
    "Txt": null,
    "Txt2": null,
    "Txt3": null,
    "Accent": null,
    "AccentTxt": null,
  }

  return {
    postcssPlugin: "plugin-tst",
    Once(root) {


      // essences.forEach((e) => {
      //   const customProps = essKeyGenerator(e);

      //   customProps.forEach((p) => {
      //     allVariables[`--${p}`] = undefined;
      //   });
      // });


      root.walkRules((rule) => {
        rule.walkDecls((decl) => {
          if(rule.selector === ":root") {
            if (decl.prop === "--cwBodyShadow") {
              stored['Bg'] = decl.value
            }
            if (decl.prop === "--cwBodyTxt") {
              stored['Txt'] = decl.value
            }
            if (decl.prop === "--cwAccentBg") {
              stored['AccentBg'] = decl.value
            }
            if (decl.prop === "--cwAccentTxt") {
              stored['AccentTxt'] = decl.value
            }
            // if (decl.prop === "--cwInputBgHover") {
            //   stored['inputBgHover'] = decl.value
            // }
            // if (decl.prop === "--cwInputSecondaryBgHover") {
            //   stored['inputSecondaryBgHover'] = decl.value
            // }
          }
          
          

        });


        // rule.walkDecls((decl) => {
        //   if(rule.selector === ":root") {
        //   if (decl.prop === "--cwInputBorder") {
        //     decl.value = stored['inputBgHover']
        //   }
        //   if (decl.prop === "--cwInputSecondaryBorder") {
        //     decl.value = stored['inputSecondaryBgHover']
        //   }
        // }

        // });
        const bg = stored['Bg'];
        const txt = stored['Txt'];
        const txt2 = tinycolor
        .mix(txt, bg, 30)
        .toHexString();
        const accentBg = stored['AccentBg'];
        const accentTxt = stored['AccentTxt'];
        
        if(rule.selector === ":root") {
          rule.append({ text: "overlay essence start" });
          rule.append({ prop: "--cwOverlayBg", value: stored['Bg']});
          rule.append({ prop: "--cwOverlayTxt", value: txt});
          rule.append({ prop: "--cwOverlayTxt2", value: txt2});
          rule.append({ prop: "--cwOverlayAccent", value: accentBg});
          rule.append({ prop: "--cwOverlayAccentTxt", value: accentTxt});
          rule.append({ prop: "--cwOverlayBlur", value: '4px'});
        }

      });





      // rule.removeAll();

      // rule.append({ text: "SKINNER ADDED VARIABLES BEGINS HERE" });


    },
  };
};
module.exports.postcss = true;
