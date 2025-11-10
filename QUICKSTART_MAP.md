# 🚀 Quick Start - Interactive Korea Map

## 30-Second Setup

1. **Open the demo**:
   ```
   Double-click: index_map.html
   ```

2. **That's it!** The map should load with the sample regions.

## ✅ What You Should See

- A dark-themed interface with a map in the center
- Multiple colored regions (Seoul, Gyeonggi, Busan, etc.)
- An info panel on the right showing instructions
- A "Reset" button in the top-right

## 🖱️ Try These Actions

### Mouse/Trackpad
1. **Hover** over a region → See tooltip with region name
2. **Click** a region → It zooms slightly, others fade to gray
3. **Click same region** → Deselects and returns to normal
4. **Click "Reset"** button → Clear selection

### Keyboard
1. **Press Tab** → Navigate between regions
2. **Press Enter** → Select focused region
3. **Press Esc** → Clear selection

### Touch (Mobile/Tablet)
1. **Tap** a region → Selects it
2. **Tap again** → Deselects
3. **Tap "Reset"** → Clear selection

## 🎯 Expected Behavior

### When You Select a Region:
- ✅ Selected region: Original color, 5% larger, glowing
- ✅ Other regions: Gray (#bfbfbf), 50% transparent
- ✅ Info panel: Updates with region name and constellation
- ✅ URL: Changes to `#regionid` (e.g., `#seoul`)

### When You Reset:
- ✅ All regions: Return to original colors
- ✅ All regions: Normal size, no glow
- ✅ Info panel: Shows default instructions
- ✅ URL: Hash is cleared

## 📦 Files Included

```
✅ index_map.html      - Main HTML structure
✅ styles_map.css      - Complete styling
✅ app_map.js          - Application logic
✅ assets/KoreaMap.svg - Sample SVG map
✅ MAP_README.md       - Full documentation
✅ QUICKSTART_MAP.md   - This file
```

## 🔄 Replace with Your SVG

1. Export your map from Adobe Illustrator as SVG
2. Save it as `assets/KoreaMap.svg` (replace existing file)
3. Ensure each region has a unique `id` attribute
4. Refresh the page

**Region ID Requirements:**
- Must be lowercase
- Use hyphens or underscores for spaces
- Examples: `seoul`, `gyeonggi`, `jeju`

## 🎨 Customize Colors

Edit `styles_map.css`, find this section:

```css
:root {
    --bg-primary: #0b0d18;     /* Change background */
    --gray-fade: #bfbfbf;      /* Change fade color */
    --active-scale: 1.05;      /* Change zoom amount */
}
```

## 🌐 Share a Link

### Direct Selection Links:
```
your-site.com/index_map.html#seoul
your-site.com/index_map.html#busan
```

When someone opens these URLs, that region will be auto-selected!

## 🐛 Troubleshooting

### Map Not Loading?

**Check:**
1. Is `assets/KoreaMap.svg` present?
2. Open browser DevTools (F12) → Console tab
3. Look for error messages

**Common Issues:**
- `404 Not Found` → Check file path
- `CORS error` → Use a local server (see below)
- `No regions detected` → Check SVG has `id` attributes

### Regions All Bunched Together?

**원인**: CSS `transform`과 SVG `transform` 속성 충돌

**해결**: ✅ 이미 수정됨! 우리 코드는 SVG transform 속성만 사용합니다.

**확인**:
```javascript
// Console에서 확인
getComputedStyle(document.querySelector('.region')).transform;
// "none" 나오면 정상 ✅
```

자세한 내용: [TRANSFORM_FIX.md](TRANSFORM_FIX.md)

### Need a Local Server?

**Option 1 - Python:**
```bash
python -m http.server 8000
# Open: http://localhost:8000/index_map.html
```

**Option 2 - Node.js:**
```bash
npx http-server -p 8000
# Open: http://localhost:8000/index_map.html
```

**Option 3 - VS Code:**
- Install "Live Server" extension
- Right-click `index_map.html` → "Open with Live Server"

## 📱 Test on Mobile

1. Get your computer's local IP:
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. Start local server (see above)

3. On phone, navigate to:
   ```
   http://YOUR_IP:8000/index_map.html
   ```

## 💡 Pro Tips

### Add More Data

Edit `app_map.js` to add constellation info:

```javascript
const CONSTELLATION_DATA = {
    seoul: '왕도의 하늘',
    busan: '바다와 별빛',
    your_region: 'Your custom text',
};
```

### Debug Mode

Open browser console and try:

```javascript
// See all detected regions
console.log(window.KoreaMap.state.regions);

// Select a region
window.KoreaMap.selectRegion('seoul');

// Get current selection
console.log(window.KoreaMap.state.selectedRegion);
```

### Change Animation Speed

In `styles_map.css`, find:

```css
.region {
    transition: ... 0.35s ease;  /* Change to 0.5s for slower */
}
```

## ✨ What's Next?

Once the basic demo works:

1. **Replace the SVG** with your real map
2. **Add region labels** in `app_map.js`
3. **Customize colors** in `styles_map.css`
4. **Add constellation data** for the info panel
5. **Deploy** to your web server

## 📚 Full Documentation

See [MAP_README.md](MAP_README.md) for:
- Complete API reference
- Accessibility features
- Browser compatibility
- Advanced customization
- Integration patterns

## 🎉 Success Checklist

- [ ] Map loads and displays regions
- [ ] Clicking a region selects it (zooms + glows)
- [ ] Other regions fade to gray
- [ ] Info panel updates with region name
- [ ] Reset button works
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Hover tooltip shows region name
- [ ] URL hash updates on selection
- [ ] Mobile touch works

If all checked ✅ — you're ready to customize!

---

**Need help?** Check the browser console (F12) for detailed error messages.

**Ready to customize?** Read the full [MAP_README.md](MAP_README.md).
