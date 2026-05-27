export const FONT_PRESETS = {
    default: ['Open Sans', 'Helvetica', 'Arial', 'sans-serif'],
    modern: ['Inter', 'system-ui', 'sans-serif'],
    formal: ['Source Serif 4', 'Georgia', 'serif'],
};

export const fontFamilyCss = (fonts: string[]): string => {
    return fonts.map(f => /\s/.test(f) ? `"${f}"` : f).join(', ');
};

export const COLOR_FAMILIES = {
    blue: { name: "#1A5C71", accent: "#2a7f9e"},
    black: { name: "#000000", accent: "#000000"},
    navy: { name: "#1B2A4E", accent: "#3D5A80" },
    forest: { name: "#1F3A2E", accent: "#3E6B52" },
    burgundy: { name: "#5C1F2E", accent: "#8B3A4E" },
    slate: { name: "#2C3E50", accent: "#5D7A95" },
    charcoal: { name: "#2B2B2B", accent: "#5A5A5A" },
    plum: { name: "#3D2B4E", accent: "#6B4C7A" },
    rust: { name: "#6B2D1F", accent: "#A0522D" },
    teal: { name: "#0F4C5C", accent: "#2A8B9C" },
    olive: { name: "#4A4A2B", accent: "#7A7A3D" },
}

export const PANEL_OPTIONS = {
    classic: ['main'],
    sidebar: ['main', 'sidebar'],
    multipanel: ['main', 'left', 'right'],
}




