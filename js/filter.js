// Data struktur kategori, filter, manual tools, restorasi, extender, colorize
const filterData = {
  filter: [
    {
      name: "Hue",
      controls: [
        { type: "range", label: "Hue 10%", prop: "hue10", min: 0, max: 100, default: 10 },
        { type: "range", label: "Hue 20%", prop: "hue20", min: 0, max: 100, default: 20 },
      ],
    },
    {
      name: "Sepia",
      controls: [
        { type: "range", label: "Sepia 10%", prop: "sepia10", min: 0, max: 100, default: 10 },
        { type: "range", label: "Sepia 20%", prop: "sepia20", min: 0, max: 100, default: 20 },
      ],
    },
    {
      name: "Grayscale",
      controls: [{ type: "toggle", label: "Grayscale On/Off", prop: "grayscale", default: false }],
    },
    {
      name: "Blur",
      controls: [
        { type: "range", label: "Gaussian Blur", prop: "gaussianBlur", min: 0, max: 10, default: 0 },
        { type: "range", label: "Motion Blur", prop: "motionBlur", min: 0, max: 10, default: 0 },
      ],
    },
  ],

  manual: [
    {
      name: "Adjust",
      controls: [
        { type: "range", label: "Brightness", prop: "brightness", min: 0, max: 200, default: 100 },
        { type: "range", label: "Contrast", prop: "contrast", min: 0, max: 200, default: 100 },
        { type: "range", label: "Saturation", prop: "saturation", min: 0, max: 200, default: 100 },
      ],
    },
    {
      name: "Restore",
      controls: [
        { type: "range", label: "Noise Reduction", prop: "noiseReduction", min: 0, max: 100, default: 0 },
        { type: "button", label: "Spot Healing", prop: "spotHealing" },
        { type: "button", label: "Scratch Removal", prop: "scratchRemoval" },
        { type: "range", label: "Sharpen", prop: "sharpen", min: 0, max: 100, default: 0 },
      ],
    },
    {
      name: "Extender",
      controls: [
        { type: "button", label: "Upscale Resolution", prop: "upscaleResolution" },
        { type: "range", label: "Enhance Details", prop: "enhanceDetails", min: 0, max: 100, default: 0 },
      ],
    },
    {
      name: "Colorize",
      controls: [
        { type: "button", label: "Auto Colorize", prop: "autoColorize" },
        { type: "range", label: "Intensity", prop: "colorizeIntensity", min: 0, max: 100, default: 50 },
        {
          type: "select",
          label: "Color Palette",
          prop: "colorPalette",
          options: ["Default", "Warm", "Cool", "Vintage", "Monochrome"],
          default: "Default",
        },
      ],
    },
  ],
};
