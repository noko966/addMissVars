const tinycolor = require("tinycolor2");
module.exports = (opts) => {
  console.log(opts);


  let lightPartners = []


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
            if (decl.prop === "--bodyBg") {
              stored['Bg'] = decl.value

              const isLight = tinycolor(decl.value).isLight();

              if(isLight) {
                lightPartners.push(opts.partnerId)
              }

              
            }
           
         
          }
          
          

        });

        console.log(lightPartners);

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
     



      });


      




      // rule.removeAll();

      // rule.append({ text: "SKINNER ADDED VARIABLES BEGINS HERE" });


    }
  };
};
module.exports.postcss = true;
