const verbalData = require("./verbalData");
const vd = require("./verbalData");
const tinycolor = require("tinycolor2");
module.exports = (opts) => {
  return {
    postcssPlugin: "plugin-tst",
    Once(root) {
      const rootAndHostRules = [];

      // Step 1: Identify and store :root and :host rules
      root.walkRules((rule) => {
        if (rule.selector === ":root" || rule.selector === ":host") {
          rootAndHostRules.push(rule);
        }
      });

      // Step 2: Process each stored rule
      rootAndHostRules.forEach((rule) => {
        // Custom logic for setting or updating properties based on previous ones
        const essences = [
          {
            name: "body",
            inherits: null,
          },
          {
            name: "accent",
            inherits: null,
          },
          {
            name: "dominant",
            inherits: ["body"],
          },
          {
            name: "button",
            inherits: ["accent"],
          },
          {
            name: "buttonSecondary",
            inherits: ["body"],
            variation: 5,
          },
          {
            name: "navbar",
            inherits: ["dominant", "body"],
          },
          {
            name: "slider",
            inherits: ["body"],
          },
          {
            name: "header",
            inherits: ["dominant", "body"],
            variation: 5,
          },
          {
            name: "subHeader",
            inherits: ["header", "dominant", "body"],
          },
          {
            name: "event",
            inherits: ["dominant", "body"],
          },
          {
            name: "eventLive",
            inherits: ["event", "body"],
            variation: 5,
          },
          {
            name: "odd",
            inherits: ["body"],
          },
          {
            name: "oddActive",
            inherits: ["accent"],
          },
          {
            name: "showMore",
            inherits: ["body"],
          },
          {
            name: "marketHeader",
            inherits: ["body", "header"],
          },
          {
            name: "collapse",
            inherits: ["header", "dominant", "body"],
          },
          {
            name: "tab",
            inherits: ["dominant", "body"],
          },
          {
            name: "tabActive",
            inherits: ["tab", "dominant", "body"],
          },
          {
            name: "tabSecondaryActive",
            inherits: ["tab", "dominant", "body"],
          },
          {
            name: "menu_1",
            inherits: ["dominant", "body"],
          },
          {
            name: "menu_2",
            inherits: ["menu_1", "dominant", "body"],
          },
          {
            name: "menu_3",
            inherits: ["menu_2", "menu_1", "dominant", "body"],
          },
          {
            name: "input",
            inherits: ["dominant", "body"],
          },
          {
            name: "inputSecondary",
            inherits: ["input", "dominant", "body"],
          },
          {
            name: "filter",
            inherits: ["input", "dominant", "body"],
          },
          {
            name: "tooltip",
            inherits: ["dominant", "body"],
          },
          {
            name: "modal",
            inherits: ["dominant", "body"],
          },
        ];

        const essKeyGenerator = (e) => {
          const essenceVerbalData = vd(e.name);
          return [
            essenceVerbalData.nameBg,
            essenceVerbalData.nameBg2,
            essenceVerbalData.nameBg3,
            essenceVerbalData.nameBgHov,
            essenceVerbalData.nameBg2Hov,
            essenceVerbalData.nameBg3Hov,
            essenceVerbalData.nameRGBA,
            essenceVerbalData.nameRGBA2,
            essenceVerbalData.nameRGBA3,
            essenceVerbalData.nameTxt,
            essenceVerbalData.nameTxt2,
            essenceVerbalData.nameTxt3,
            essenceVerbalData.nameAccent,
            essenceVerbalData.nameAccentTxt,
            essenceVerbalData.nameBorder,
            essenceVerbalData.nameRadius,
          ];
        };

        const allVariables = {};

        essences.forEach((e) => {
          const customProps = essKeyGenerator(e);

          customProps.forEach((p) => {
            allVariables[`--${p}`] = undefined;
          });
        });

        rule.walkDecls((decl) => {
          if (decl.prop === "--bodyBg" && decl.variable) {
            allVariables["--bodyBg"] = decl.value;
          }
          if (decl.prop === "--accentBg" && decl.variable) {
            allVariables["--accentBg"] = decl.value;
          }

          for (const key in allVariables) {
            if (decl.prop === key && decl.variable) {
              allVariables[key] = decl.value;
            }
          }
        });

        rule.append({ text: "SKINNER ADDED VARIABLES BEGINS HERE" });
        essences.forEach((e) => {
          const customProps = essKeyGenerator(e);
          customProps.forEach((p) => {
            const prop = `--${p}`;
            let val = allVariables[prop];
            let isDark;
            const vd = verbalData(e.name);
            switch (prop) {
              case `--${vd.nameBg}`:
                if (allVariables[prop]) {
                  val = allVariables[prop];
                  isDark = tinycolor(val).getLuminance();
                  isDark = isDark < 0.5 ? true : false;
                } else {
                  let fb = e.inherits.find((i) => {
                    let fbEss = `--${i}Bg`;
                    return allVariables[fbEss];
                  });

                  let idx = e.inherits.findIndex((i) => i === fb);
                  let fbArr = [
                    `--${fb}BgHover`,
                    `--${fb}Bg2`,
                    `--${fb}Bg2Hover`,
                  ];
                  val = allVariables[`--${fb}Bg`];
                  isDark = tinycolor(val).getLuminance();
                  isDark = isDark < 0.5 ? true : false;
                  val = isDark
                    ? tinycolor(val).lighten(3).toHexString()
                    : tinycolor(val).darken(3).toHexString();
                }
                break;

              case `--${vd.nameBg2}`:
                if (allVariables[prop]) {
                  val = allVariables[prop];
                } else {
                  val = allVariables[`--${vd.nameBg}`];
                  val = isDark
                    ? tinycolor(val).lighten(10).toHexString()
                    : tinycolor(val).darken(10).toHexString();
                }
                break;

              case `--${vd.nameBg3}`:
                if (allVariables[prop]) {
                  val = allVariables[prop];
                } else {
                  val = allVariables[`--${vd.nameBg2}`];
                  val = isDark
                    ? tinycolor(val).lighten(10).toHexString()
                    : tinycolor(val).darken(10).toHexString();
                }
                break;
            }
            rule.append({ prop: prop, value: val || "#fff" });
          });
        });

        // console.log(allVariables);
      });
    },
  };
};
module.exports.postcss = true;
