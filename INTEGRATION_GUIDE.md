# 🔗 Integration Guide: Map + Star Story

How to integrate the interactive map with your existing "별과 땅의 이야기" project.

## 📋 Overview

You now have two separate systems:

1. **Star Story** ([index.html](index.html)) - Interactive constellation storytelling
2. **Interactive Map** ([index_map.html](index_map.html)) - Region selection with SVG

This guide shows how to combine them into one unified experience.

## 🎯 Integration Options

### Option 1: Map as Story Entry Point

Use the map as a visual navigation to select regions, then launch stories.

### Option 2: Story Triggers Map Highlight

When viewing a story, automatically highlight the corresponding region on the map.

### Option 3: Side-by-Side View

Show both the map and story content simultaneously (desktop).

## 🚀 Quick Integration (Recommended)

### Step 1: Add Map to Existing Story Page

Edit [index.html](index.html), add this before the main canvas:

```html
<!-- Add this after the title-zone -->
<section class="map-navigation" role="navigation" aria-label="지역 선택">
    <div id="miniMapContainer" class="mini-map-container"></div>
    <p class="map-hint">지도에서 지역을 선택하여 이야기를 시작하세요</p>
</section>
```

### Step 2: Load Map Script

Add to the bottom of [index.html](index.html), before `</body>`:

```html
<script src="app_map.js"></script>
<script src="integration.js"></script>
```

### Step 3: Create Integration Bridge

Create `integration.js`:

```javascript
/**
 * Integration Bridge: Map ↔ Star Story
 */

// Wait for both systems to load
document.addEventListener('DOMContentLoaded', async () => {
    // Map region IDs to story region IDs
    const REGION_MAPPING = {
        seoul: 'hanyang',
        gyeonggi: 'gwangmyeong',
        gangwon: 'gangneung',
        gyeongbuk: 'gyeongju',
        jeonbuk: 'jeonju',
        chungnam: 'buyeo',
        gyeongnam: 'gaeseong',
        jeju: 'jeju',
    };

    // Listen for map selections
    document.addEventListener('regionSelected', (event) => {
        const mapRegionId = event.detail.regionId;
        const storyRegionId = REGION_MAPPING[mapRegionId];

        if (storyRegionId && window.AppState) {
            // Find matching story region
            const storyRegion = window.AppState.regions.find(
                r => r.id === storyRegionId
            );

            if (storyRegion) {
                // Trigger story modal
                const hotspot = document.querySelector(
                    `.hotspot[data-region-id="${storyRegionId}"]`
                );
                if (hotspot) {
                    hotspot.click();
                }
            }
        }
    });

    // Listen for story selections
    document.addEventListener('storyOpened', (event) => {
        const storyRegionId = event.detail.regionId;

        // Reverse lookup to find map region
        const mapRegionId = Object.keys(REGION_MAPPING).find(
            key => REGION_MAPPING[key] === storyRegionId
        );

        if (mapRegionId && window.KoreaMap) {
            // Highlight on map
            window.KoreaMap.selectRegion(mapRegionId);
        }
    });
});
```

### Step 4: Emit Events from Existing Code

Edit [script.js](script.js), in `showStoryModal()` function, add:

```javascript
function showStoryModal(region) {
    // ... existing code ...

    // Emit event for integration
    document.dispatchEvent(new CustomEvent('storyOpened', {
        detail: { regionId: region.id }
    }));
}
```

Edit `app_map.js`, in `selectRegion()` function, add:

```javascript
function selectRegion(id) {
    // ... existing code ...

    // Emit event for integration
    document.dispatchEvent(new CustomEvent('regionSelected', {
        detail: { regionId: id }
    }));
}
```

### Step 5: Add Styling

Add to [styles.css](styles.css):

```css
/* Map Navigation Section */
.map-navigation {
    max-width: 600px;
    margin: 2rem auto;
    text-align: center;
}

.mini-map-container {
    background: var(--bg-secondary, #1a1d2e);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mini-map-container svg {
    max-height: 400px;
    width: auto;
    margin: 0 auto;
}

.map-hint {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #b0b8c9);
}

@media (max-width: 768px) {
    .map-navigation {
        margin: 1rem;
    }

    .mini-map-container {
        padding: 1rem;
    }
}
```

## 🎨 Advanced Integration Patterns

### Pattern A: Tab Navigation

Add tabs to switch between map view and story view:

```html
<nav class="view-tabs" role="tablist">
    <button role="tab" aria-selected="true" data-view="map">
        지도 보기
    </button>
    <button role="tab" aria-selected="false" data-view="story">
        별자리 보기
    </button>
</nav>

<div id="mapView" role="tabpanel">
    <!-- Map content -->
</div>

<div id="storyView" role="tabpanel" hidden>
    <!-- Story content -->
</div>
```

### Pattern B: Synchronized Highlights

When hovering over a region on the map, highlight the corresponding hotspot:

```javascript
// In integration.js
document.addEventListener('regionHover', (event) => {
    const mapRegionId = event.detail.regionId;
    const storyRegionId = REGION_MAPPING[mapRegionId];

    if (storyRegionId) {
        const hotspot = document.querySelector(
            `.hotspot[data-region-id="${storyRegionId}"]`
        );
        if (hotspot) {
            hotspot.classList.add('highlight-hint');
        }
    }
});
```

### Pattern C: Mini-Map in Story Modal

Show a small map inside the story modal:

```javascript
function showStoryModal(region) {
    // ... existing code ...

    // Add mini map indicator
    const miniMap = document.createElement('div');
    miniMap.className = 'story-mini-map';
    miniMap.innerHTML = `
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="8" fill="${region.theme_color}" />
            <text x="50" y="75" text-anchor="middle" fill="white" font-size="12">
                ${region.region_name_kr}
            </text>
        </svg>
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.insertBefore(miniMap, modalContent.firstChild);
}
```

## 📊 Data Structure Alignment

### Current Story Data (data.json)

```json
{
    "regions": [
        {
            "id": "gwangmyeong",
            "region_name_kr": "광명시",
            "coordinates": { "x": 280, "y": 450 },
            "theme_color": "#FFD93D"
        }
    ]
}
```

### Map Region IDs (KoreaMap.svg)

```xml
<path id="gyeonggi" ... />
<path id="seoul" ... />
```

### Mapping Table

| Map ID | Story ID | Region Name |
|--------|----------|-------------|
| seoul | hanyang | 한양/서울 |
| gyeonggi | gwangmyeong | 경기/광명 |
| gangwon | gangneung | 강원/강릉 |
| gyeongbuk | gyeongju | 경북/경주 |
| jeju | jeju | 제주 |
| jeonbuk | jeonju | 전북/전주 |
| chungnam | buyeo | 충남/부여 |

## 🔄 Two-Way Data Binding

Create a shared state manager:

```javascript
// shared-state.js
const SharedState = {
    currentRegion: null,
    listeners: new Set(),

    setRegion(regionId, source) {
        this.currentRegion = regionId;
        this.notify({ regionId, source });
    },

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    },

    notify(data) {
        this.listeners.forEach(cb => cb(data));
    }
};

// Usage in map
window.KoreaMap.onSelect = (id) => {
    SharedState.setRegion(id, 'map');
};

// Usage in story
window.StoryApp.onSelect = (id) => {
    SharedState.setRegion(id, 'story');
};

// Listen for changes
SharedState.subscribe(({ regionId, source }) => {
    console.log(`Region ${regionId} selected from ${source}`);
    // Update both views accordingly
});
```

## 🎭 UX Flow Examples

### Flow 1: Map → Story

1. User opens [index.html](index.html)
2. Sees map with regions
3. Clicks "서울" on map
4. Story modal opens with "한양" story
5. Constellation appears in sky
6. User can close modal and select another region

### Flow 2: Story → Map Highlight

1. User clicks hotspot directly on main canvas
2. Story modal opens
3. Corresponding region highlights on mini-map
4. User can see geographic context

### Flow 3: Dual View (Desktop)

1. Left side: Interactive map
2. Right side: Story content
3. Synchronized highlighting
4. Click either side to navigate

## 📱 Responsive Considerations

### Mobile (< 768px)
- Stack map above story canvas
- Use tabs to switch between views
- Simplified mini-map

### Tablet (768px - 1024px)
- Side-by-side on landscape
- Stacked on portrait

### Desktop (> 1024px)
- Full dual-pane layout
- Picture-in-picture mini-map
- Simultaneous interaction

## 🧩 Component Architecture

```
┌─────────────────────────────────────┐
│         index.html (Main)           │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Map View   │  │  Story View  │ │
│  │ (app_map.js)│  │ (script.js)  │ │
│  └──────┬──────┘  └───────┬──────┘ │
│         │                 │         │
│         └────┬─Integration─┘        │
│              │  (shared-state)      │
│         ┌────▼──────┐               │
│         │ Data Layer │               │
│         │ (data.json)│               │
│         └───────────┘                │
└─────────────────────────────────────┘
```

## ✅ Testing Checklist

- [ ] Map selection triggers story modal
- [ ] Story modal highlights map region
- [ ] Reset clears both map and story state
- [ ] Keyboard navigation works across both
- [ ] Mobile touch works on both systems
- [ ] URL hash updates correctly
- [ ] Back button navigation works
- [ ] No console errors
- [ ] Accessibility preserved (screen readers)
- [ ] Performance acceptable (< 60ms updates)

## 🚀 Deployment

### Option 1: Single Page

Merge everything into [index.html](index.html):
- Keeps URL simple
- All features in one place
- May be heavy on initial load

### Option 2: Separate Pages

Keep [index.html](index.html) and [index_map.html](index_map.html) separate:
- Lighter initial load
- Can link between them
- More modular

### Option 3: Progressive Enhancement

Start with story, add map as enhancement:
```javascript
if ('IntersectionObserver' in window) {
    // Load map only when scrolled into view
    loadMapWhenVisible();
}
```

## 🎨 Styling Harmony

Ensure consistent design tokens across both:

```css
/* shared-variables.css */
:root {
    --bg-primary: #0b0d18;
    --bg-secondary: #1a1d2e;
    --text-primary: #ffffff;
    --text-secondary: #b0b8c9;
    --transition-duration: 0.35s;
}
```

Import in both CSS files:
```css
@import url('shared-variables.css');
```

## 📚 Resources

- [MAP_README.md](MAP_README.md) - Map documentation
- [ASSET_GUIDE.md](ASSET_GUIDE.md) - Story assets guide
- [index.html](index.html) - Main story page
- [index_map.html](index_map.html) - Standalone map

## 🎯 Quick Win: Minimal Integration

Add just one line to [index.html](index.html):

```html
<a href="index_map.html" class="map-link">
    🗺️ 지도에서 지역 선택하기
</a>
```

Style it:
```css
.map-link {
    display: inline-block;
    margin: 1rem auto;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
}

.map-link:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}
```

Done! Users can now navigate between the two experiences.

---

**Choose your integration level based on project requirements and timeline.**

**Start simple, enhance progressively.** ✨
