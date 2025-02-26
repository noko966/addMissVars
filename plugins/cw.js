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
          if (decl.prop === "--cwRegisterBg2") {
            stored['Bg'] = decl.value
          }
          if (decl.prop === "--cwRegisterBg2Hover") {
            stored['BgHov'] = decl.value
          }
          if (decl.prop === "--cwRegisterTxt") {
            stored['Txt'] = decl.value
          }
          if (decl.prop === "--cwRegisterTxt2") {
            stored['Txt2'] = decl.value
          }
          if (decl.prop === "--cwRegisterTxt3") {
            stored['Txt3'] = decl.value
          }
          if (decl.prop === "--cwRegisterAccent") {
            stored['Accent'] = decl.value
          }
          if (decl.prop === "--cwRegisterAccentTxt") {
            stored['AccentTxt'] = decl.value
          }

        });


        rule.walkDecls((decl) => {
          if (decl.prop === "--cwInputSecondaryBg") {
            decl.value = stored['Bg']
          }
          if (decl.prop === "--cwInputSecondaryG") {
            decl.value = stored['Bg']
          }
         if (decl.prop === "--cwInputSecondaryBgHover") {
            decl.value = stored['BgHov']
         }
         if (decl.prop === "--cwInputSecondaryTxt") {
            decl.value = stored['Txt']
         }
         if (decl.prop === "--cwInputSecondaryTxt2") {
            decl.value = stored['Txt2']
         }
         if (decl.prop === "--cwInputSecondaryTxt3") {
          decl.value = stored['Txt3']
        }
         if (decl.prop === "--cwInputSecondaryAccent") {
            decl.value = stored['Accent']
         }
         if (decl.prop === "--cwInputSecondaryAccentTxt") {
            decl.value = stored['AccentTxt']
         }

        });

      });





      // rule.removeAll();

      // rule.append({ text: "SKINNER ADDED VARIABLES BEGINS HERE" });


    },
  };
};
module.exports.postcss = true;
